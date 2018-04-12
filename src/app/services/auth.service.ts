import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { AngularFireList } from 'angularfire2/database/interfaces';
import { User } from '../models/user';
import { database } from 'firebase/app';
import { KeyService } from './key.service';
import { Events } from 'ionic-angular';
import { StorageProvider } from '../../providers/firebase/storage';
import { TwoFactorAuthService } from './twofactorauth.service';

@Injectable()

export class AuthService {
    public user: firebase.User;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider, private events: Events,
                private twoFactorAuthService: TwoFactorAuthService) {
        this.firebaseAuth.authState.first()
            .subscribe((user) => {
                if (user) {
                    this.user = user;
                } else {
                    this.logout();
                }
            });
        this.events.subscribe('user:loggedOut', () => {
            this.logout();
        });
    }

    // Login / Sign Up Functions

    // Creates a new user with Firebase Auth using the Email and Password Provider ***
    public signup(user: FormGroup) {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password)
                .then((response) => {
                    this.firebaseData.addUser(response.email, response.uid, undefined);
                    resolve(response);
                    // Stores the user email on Firebase Realtime DB
                })
                .catch((error) => {
                    // There was an error
                    reject(error);
                });
        });
    }

    // Logins an already registered user using Firebase Auth Email and Password Provider
    public login(email: string, password: string) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    // Logins a user using Firebase Auth with the Google Provider ***
    public loginGoogle() {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            .then(() => {
                this.firebaseAuth.auth.getRedirectResult()
                .then((response) => {
                    this.firebaseData.addUser(response.user.email, response.user.uid, response.user.photoURL);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
            });
        });
    }

    // Logs out the current user
    public logout() {
        this.firebaseAuth.auth.signOut();
    }

    // Verifies the Email associated with the user (only email and password provider)
    public sendVerificationEmail() {
        return this.firebaseAuth.auth.currentUser.sendEmailVerification();
    }

    // Restores the password by sending an email to the user (only email and password provider)
    public restorePassword() {
        return firebase.auth().sendPasswordResetEmail(this.user.email);
    }

    // CRUD Operations that require information from the user

    // Gets the user object from the Auth Service for use on the App
    public getLoggedUser(): User {
        this.user = firebase.auth().currentUser;
        return new User(this.user.uid, this.user.email, this.user.emailVerified,
                        this.user.phoneNumber, this.user.photoURL);
    }

    public activate2FAU(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getIdToken(true)
            .then((token) => {
                this.twoFactorAuthService.active2FAU(token)
                .subscribe((res) => {
                    resolve(res);
                }, (error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    public validate2FAU(token: number) {
        return new Promise((resolve, reject) => {
            this.user.getIdToken(true)
            .then((idToken) => {
                this.twoFactorAuthService.validateToken(idToken, token)
                .subscribe((res) => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    public verify2FAU(token: number) {
        return new Promise((resolve, reject) => {
            this.user.getIdToken(true)
            .then((idToken) => {
                this.twoFactorAuthService.verifySecret(idToken, token)
                .subscribe((res) => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });

    }

    public deactivate2FAU() {
        return new Promise ((resolve, reject) => {
            this.user.getIdToken(true)
            .then((idToken) => {
                this.twoFactorAuthService.deactivate2FA(idToken)
                .subscribe((res) => {
                    resolve(res);
                }, (error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
}
