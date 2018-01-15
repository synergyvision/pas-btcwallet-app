import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { RestService } from './rest.service';
import { User } from '../models/user';

@Injectable()
export class AuthService {
    public user: firebase.User;
    public status: Observable<firebase.User>;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider,
                private restService: RestService) {
        this.status = this.firebaseAuth.authState;
        this.status.subscribe(
            (user) => {
                if (user) {
                    this.user = user;
                    console.log(this.user);
                } else {
                    this.user = null;
                }
            },
        );
    }

    public signup(user: FormGroup): any {
        const response = this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password);
        console.log(this.firebaseAuth.auth.currentUser);
        //this.user.sendEmailVerification();
        this.restService.createWallet();
        return response;
    }

    public login(email: string, password: string) {
        const response = this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
        return response;
    }

    public loginGoogle() {
        const response = this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        //this.user.sendEmailVerification();
        return response;
        // Verify the wallet
    }
    public logout() {
        this.firebaseAuth.auth.signOut();
        this.user = null;
    }

    public getLoggedUser() {
        this.user = firebase.auth().currentUser;
        if (this.user) {
            const userApp = new User(this.user.uid, this.user.email, this.user.phoneNumber, this.user.emailVerified);
            return userApp;
        } else {
            this.user = null;
            return null;
        }
    }

    public sendVerificationEmail() {
        this.user.sendEmailVerification();
    }
}
