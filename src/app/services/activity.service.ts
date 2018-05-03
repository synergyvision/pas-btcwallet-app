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
            const paymentSend = new Activity(date, 'ACTIVITY.paymentSent',
            { value: amount, currency: crypto  });
            this.addActivity(paymentSend);
        });
    }
    private loginActivity() {
        this.events.subscribe('user:loggedIn', () => {
            this.uid = this.authService.user.uid;
            const date = this.authService.user.metadata.lastSignInTime;
            const loginActivity = new Activity(date, 'ACTIVITY.logged_in');
            this.addActivity(loginActivity);
        });
    }

    private addActivity(activity: Activity) {
        console.log(activity);
        this.dataProvider.addActivity(this.uid, activity);
    }
}
