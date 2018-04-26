import { Injectable } from '@angular/core';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Events } from 'ionic-angular';
import { AuthService } from './auth.service';
import { Activity } from '../models/activity';

@Injectable()

/* 
Service for handling Activitys to be stored on the realtime database
*/
export class ActivityService {
    private uid: string;

    constructor(private dataProvider: FirebaseProvider, private events: Events, private authService: AuthService) {
        this.events.subscribe('user:loggedIn', () => {
            this.uid = this.authService.user.uid;
            this.addLastLogin();
        });
    }

    public addLastLogin() {
        const date = this.authService.user.metadata.lastSignInTime;
        const loginActivity = new Activity(date, 'ACTIVITY.logged_in');
        this.dataProvider.addActivity(this.uid, loginActivity);
    }
}
