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

/*
Service for handling the authentication of the user on the App
Currently uses Firebase Auth for handling passwords and sessions states
*/

export class AuthService {
    public user: firebase.User;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider, private events: Events,
                private twoFactorAuthService: TwoFactorAuthService) {
        // This keeps an Observable of the Auth State of the Application
        this.firebaseAuth.authState.first()
            .subscribe((user) => {
                // Every time the authState Changes, we update accordingly
                if (user) {
                    this.user = user;
                } else {
                    this.logout();
                }
            });
        this.events.subscribe('user:loggedOut', () => {
            this.logout();
        });

        this.events.subscribe('user:newUser', () => {
            this.setProfilePicture();
        });
    }

    // Login / Sign Up Functions

    // Creates a new user with Firebase Auth using the Email and Password Provider
    public signup(user: FormGroup) {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password)
                .then((response) => {
                    // We store the user on Firebase Realtime DataBase
                    this.firebaseData.addUser(response.email, response.uid, undefined);
                    resolve(response);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }


    // Logins an already registered user using Firebase Auth Email and Password Provider
    public login(email: string, password: string) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    // Logins a user using Firebase Auth with the Google Provider
    public loginGoogle() {
        return new Promise((resolve, reject) => {
            // It uses signInWithRedirect function to be able to have Cordova Compatibility
            this.firebaseAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            .then(() => {
                this.firebaseAuth.auth.getRedirectResult()
                .then((response) => {
                    // We store the user on Firebase Realtime DataBase
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

    // Verifies the Email associated with the user (only for the email and password provider)
    public sendVerificationEmail() {
        return this.firebaseAuth.auth.currentUser.sendEmailVerification();
    }

    // Restores the password by sending an email to the user (only for the email and password provider)
    public restorePassword() {
        return firebase.auth().sendPasswordResetEmail(this.user.email);
    }

    public recoverPassword(email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.firebaseData.getUserByEmail(email)
            .subscribe((user) => {
                if (user.length > 0) {
                    firebase.auth().sendPasswordResetEmail(this.user.email)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((emailError) => {
                        reject(emailError);
                    });
                } else {
                    reject('ERROR.FIREBASE.auth/user-not-found');
                }
            }, (error) => {
                    reject(error);
            });
        });
    }

    // Gets the user object from the Auth Service for use on the App
    public getLoggedUser(): User {
        this.user = firebase.auth().currentUser;
        return new User(this.user.uid, this.user.email, this.user.emailVerified,
                        this.user.phoneNumber, this.user.photoURL);
    }

    public setProfilePicture() {
        this.firebaseData.getProfilePicture(this.user.uid)
            .subscribe((photo) => {
                this.firebaseAuth.auth.currentUser
                .updateProfile({
                    displayName: this.user.displayName,
                    photoURL: photo,
            });
        });
    }

    // 2FAU Functions

    /*
    Since the 2FAU server requires a token, we send the IdToken of the logged in user
    This allows Firebase Auth to handle the authentification and adds another security factor to the App
    The IdToken is explained on: https://firebase.google.com/docs/auth/admin/verify-id-tokens
    */

    // Creates the request of 2FA for the logged user
    public activate2FAU(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.user.getIdToken(true)
            .then((token) => {
                // We redirect to the twoFactorAuth Service
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

    // Validates the token sent by the user
    public validate2FAU(token: number) {
        return new Promise((resolve, reject) => {
            this.user.getIdToken(true)
            .then((idToken) => {
                // We redirect to the twoFactorAuth Service
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

    // Activates the 2FA for the logged user (need to have a pending 2FA request)
    public verify2FAU(token: number) {
        return new Promise((resolve, reject) => {
            this.user.getIdToken(true)
            .then((idToken) => {
                // We redirect to the twoFactorAuth Service
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

    // Deactivates the 2FA for the logged user

    public deactivate2FAU() {
        return new Promise ((resolve, reject) => {
            this.user.getIdToken(true)
            .then((idToken) => {
                // We redirect to the twoFactorAuth Service
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
