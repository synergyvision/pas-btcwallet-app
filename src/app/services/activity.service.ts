import { Injectable } from '@angular/core';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Events } from 'ionic-angular';
import { AuthService } from './auth.service';
import { Activity } from '../models/activity';
import { ITransaction } from '../interfaces/ITransaction';
import { Wallet } from '../models/wallet';
import { CryptoCoin } from '../models/crypto';

@Injectable()

/*
Service for handling Activitys to be stored on the realtime database
*/
export class ActivityService {
    private uid: string;

    constructor(private dataProvider: FirebaseProvider, private events: Events, private authService: AuthService) {
        this.loginActivity();
        this.changedPassword();
        this.paymentSent();
        this.imageChanged();
    }

    private changedPassword() {
        this.events.subscribe('user:passwordChanged', () => {
            const date = new Date().toDateString();
            const passwordActivity = new Activity(date, 'ACTIVITY.password_changed');
            this.addActivity(passwordActivity);
        });
    }

    private paymentSent() {
        this.events.subscribe('user:paymentSent', (amount: number, crypto: CryptoCoin, date: string) => {
            this.uid = this.authService.user.uid;
            const paymentSend = new Activity(date, 'ACTIVITY.payment_sent',
                { value: amount,
                exchange: crypto.units.exchange,
                name: crypto.units.name,
                },
            );
            this.addActivity(paymentSend);
        });
    }
    private loginActivity() {
        this.events.subscribe('user:loggedIn', () => {
            console.log(this.authService.user);
            this.uid = this.authService.getLoggedUser().uid;
            const date = this.authService.user.metadata.lastSignInTime;
            const loginActivity = new Activity(date, 'ACTIVITY.logged_in');
            this.addActivity(loginActivity);
        });
    }

    private imageChanged() {
        this.events.subscribe('user:imageChanged', () => {
            this.uid = this.authService.user.uid;
            const date = new Date().toDateString();
            const imageChangedActivity = new Activity(date, 'ACTIVITY.image_changed');
            this.addActivity(imageChangedActivity);
        })
    }

    private addActivity(activity: Activity) {
        this.dataProvider.addActivity(this.uid, activity);
    }
}
