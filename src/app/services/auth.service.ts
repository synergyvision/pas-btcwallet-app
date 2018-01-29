import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { AngularFireList } from 'angularfire2/database/interfaces';
import { RestService } from './rest.service';
import { User } from '../models/user';
import { Wallet } from '../models/wallet';
import { database } from 'firebase/app';
import { IBalance } from '../models/IBalance';

@Injectable()
export class AuthService {
    public user: User;
    public addressBook: AngularFireList<any>;
    public balance: IBalance;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider,
                private restService: RestService) {
        this.firebaseAuth.authState.subscribe(
            (user) => {
                if (user) {
                    this.user = this.getLoggedUser(user);
                    this.firebaseData.getWallets(user.uid)
                        .subscribe((data) => {
                            this.restService.balance = this.restService.getBalanceFromWallet(data[0]);
                        });
                } else {
                    this.user = null;
                }
            },
        );
    }

    public signup(user: FormGroup): Promise<any> {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password)
            .then((response) => {
                this.restService.createData(user.value.email, response.uid)
                .subscribe((iWallet) => {
                    const newWallet = {
                        addresses: iWallet.addresses,
                        name: iWallet.name,
                        toke: iWallet.token,
                    };
                    this.firebaseData.addWallet(newWallet, response.uid);
                    this.logout();
                    resolve(response);
                },
                (error) => {
                    this.firebaseAuth.auth.currentUser.delete();
                    reject(error);
                });
            })
            .catch((error) => {
                console.log('ERROR ON CREATE USER' + error);
                reject(error);
            });
        });
       /*  const res = this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password);
        // The Firebase service has created the user and automatically logged them
        Observable.fromPromise(res)
        .first()
        .subscribe((response) => {
            // this.user.sendEmailVerification();
            // We create the user wallet
            this.restService.createData(user.value.email, response.uid)
                .subscribe((iWallet) => {
                    const newWallet = {
                        addresses: iWallet.addresses,
                        name: iWallet.name,
                        toke: iWallet.token,
                    };
                    this.firebaseData.addWallet(newWallet, response.uid);
                    this.logout();
                    console.log('here');
                    return response;
                },
                (error) => {
                    this.firebaseAuth.auth.currentUser.delete();
                    return error;
                });
        }, (
        }); */
    }

    public login(email: string, password: string) {
        const response = this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
        return response;
    }

    public loginGoogle() {
        const response = this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        // this.user.sendEmailVerification();
        return response;
        // Verify the wallet
    }
    public logout() {
        this.user = null;
        this.firebaseAuth.auth.signOut();
    }

    public getLoggedUser(user: firebase.User) {
        this.user = new User(user.uid, user.email, user.emailVerified, user.phoneNumber, user.photoURL);
        return this.user;
    }

    public addAddress(form: FormGroup) {
        // We need to check if this address exist
        // If it does we add it to the list
        this.firebaseData.addAddressToAddressBook(this.user.uid, form.value);
        console.log(this.firebaseData.getAddressBook(this.user.uid));
    }

    public sendVerificationEmail() {
        this.firebaseAuth.auth.currentUser.sendEmailVerification();
    }
}
