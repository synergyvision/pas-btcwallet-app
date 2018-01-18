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

@Injectable()
export class AuthService {
    public user: User;
    public addressBook: AngularFireList<any>;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider,
                private restService: RestService) {
        this.firebaseAuth.authState.subscribe(
            (user) => {
                if (user) {
                    this.user = this.getLoggedUser(user);
                    this.getWallets();
                    this.getAddressList();
                } else {
                    this.user = null;
                }
            },
        );
    }

    public signup(user: FormGroup) {
        const res = this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password);
        // The Firebase service has created the user and automatically logged them
        res.then((response) => {
            // this.user.sendEmailVerification();
            // We create the user wallet
            this.restService.createData(user.value.email, user.value.password, response.uid)
                .subscribe(
                    (wallet) => {
                    wallet.subscribe((iWallet) => {
                        const newWallet = new Wallet(iWallet.addresses, iWallet.name, iWallet.token);
                        this.user.wallets.push(newWallet);
                        this.firebaseData.addWallet(newWallet, response.uid);
                    },
                    (error) => {
                        console.log(error);
                    });
                });
        })
        .catch((error) => {
                console.log('ERROR ON CREATE USER' + error);
        });
        // User Created! We Log him out
        this.logout();
        return res;
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

    public getWallets() {
        this.firebaseData.getWallets(this.user.uid)
        .subscribe((data) => {
            if (data) {
                this.user.wallets = data;
            } else {
                this.user.wallets = [{}];
            }
        });
    }

    public getAddressList() {
        this.firebaseData.getAddressBook(this.user.uid)
        .subscribe((data) => {
            if (data) {
                this.addressBook = data;
            }
        });
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
