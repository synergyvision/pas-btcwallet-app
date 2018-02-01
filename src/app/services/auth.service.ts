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
import { KeyService } from './key.service';
import { IHDWallet } from '../models/IHDWallet';

@Injectable()
export class AuthService {
    public user: User;
    public wallet: Wallet;
    public balance: Observable<IBalance>;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider,
                private restService: RestService, private keyService: KeyService) {
            this.firebaseAuth.authState.subscribe(
            (user) => {
                if (user) {
                    this.user = this.getLoggedUser(user);
                    this.firebaseData.getWallets(user.uid)
                        .subscribe((data) => {
                            this.wallet = data[0];
                            this.balance = this.restService.getBalanceFromWallet(data[0]);
                        });
                } else {
                    this.user = null;
                }
            },
        );
    }

    public authState(): Observable<any> {
        return this.firebaseAuth.authState;
    }

    public signup(user: FormGroup): Promise<any> {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password)
            .then((response) => {
               /*  // Wallets
                this.restService.createData(response.uid)
                .subscribe((iWallet) => {
                    const newWallet = {
                        addresses: iWallet.addresses,
                        name: iWallet.name,
                    };
                    this.firebaseData.addUser(user.value.email, response.uid);
                    this.firebaseData.addWallet(newWallet, response.uid);
                    this.logout();
                    resolve(response);
                },
                (error) => {
                    this.firebaseAuth.auth.currentUser.delete();
                    reject(error);
                }); */

                // HD Wallets
                const keys = this.keyService.createKeys(user.value.password);
                const data = {
                    name: 'HDW' + response.uid.substring(0, 22),
                    extended_public_key: keys.xpub,
                  };
                this.restService.createWalletHD(data)
                .subscribe((hdWallet) => {
                    const newWallet = new Wallet(hdWallet.name, keys);
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
        this.firebaseData.addAddressToAddressBook(this.user.uid, form.value);
    }

    public sendVerificationEmail() {
        this.firebaseAuth.auth.currentUser.sendEmailVerification();
    }

    public updateBalance() {
        if (this.wallet !== undefined) {
            this.balance = this.restService.getBalanceFromWallet(this.wallet);
        }
    }

    public getWallets() {
        return this.firebaseData.getWallets(this.user.uid);
    }

    public getWalletAddress(email: string): Observable<Wallet> {
        return this.firebaseData.getWalletByEmail(email)
        .map((userData) => {
            let wallet = (userData[0].wallet ? Object.values(userData[0].wallet) : null)[0];
            // this.restService.addAddressToWallet(wallet)
            // .subscribe((response) => {
            //    wallet = response;
            //    console.log(wallet);
            // });
            const key = Object.keys(userData[0].wallet)[0];
            this.firebaseData.updateWallet(wallet, userData[0].key, key);
            return wallet;
        }, (error) => {
            return error;
        });
    }
}
