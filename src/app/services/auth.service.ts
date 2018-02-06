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
import { Events } from 'ionic-angular';
import { ITransactionSke } from '../models/ITransaction';
import { ErrorService } from './error.service';

@Injectable()
export class AuthService {
    public user: User;
    public wallet: Wallet;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider, private events: Events,
                private restService: RestService, private keyService: KeyService) {
        this.firebaseAuth.authState.first()
        .subscribe((user) => {
            if (user) {
                this.user = this.getLoggedUser(user);
            } else {
                this.logout();
            }
        });
    }

    public signup(user: FormGroup): Promise<any> {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password)
                .then((response) => {
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
                            this.firebaseData.addUser(user.value.email, response.uid);
                            this.logout();
                            resolve(response);
                        },
                        (error) => {
                            this.firebaseAuth.auth.currentUser.delete();
                            reject(error);
                        });
                })
                .catch((error) => {
                    this.firebaseAuth.auth.currentUser.delete();
                    reject(error);
                });
        });
    }

    public login(email: string, password: string) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    public loginGoogle() {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then((response) => {
                    console.log(response);
                    if (response.additionalUserInfo.isNewUser) {
                        // HD Wallets
                        const keys = this.keyService.createKeys();
                        const data = {
                            name: 'HDW' + response.user.uid.substring(0, 22),
                            extended_public_key: keys.xpub,
                        };
                        this.restService.createWalletHD(data)
                            .subscribe((hdWallet) => {
                                const newWallet = new Wallet(hdWallet.name, keys);
                                this.firebaseData.addWallet(newWallet, response.user.uid);
                                this.firebaseData.addUser(response.user.email, response.user.uid);
                                this.logout();
                                resolve(response);
                            },
                            (error) => {
                                this.firebaseAuth.auth.currentUser.delete();
                                reject(error);
                            });
                        } else {
                            resolve(response);
                        }
                })
                .catch((error) => {
                    console.log('ERROR ON CREATE USER' + error);
                    this.firebaseAuth.auth.currentUser.delete();
                    reject(error);
                });
        });
    }

    public logout() {
        this.firebaseAuth.auth.signOut();
        this.events.publish('user:loggedOut');
    }

    public getLoggedUser(user: firebase.User) {
        this.user = new User(user.uid, user.email, user.emailVerified, user.phoneNumber, user.photoURL);
        return this.user;
    }

    public sendVerificationEmail() {
        this.firebaseAuth.auth.currentUser.sendEmailVerification();
    }

    public updateBalance(): Observable<IBalance> {
        return this.getWalletsAsync()
        .first()
        .flatMap((wallet) => {
            return this.restService.getBalanceFromWallet(wallet[0]);
        });
    }

    public getWalletsAsync(): Observable<any> {
        if (this.user) {
            return this.firebaseData.getWallets(this.user.uid);
        } else {
            return this.firebaseAuth.authState.first()
            .flatMap((user) => {
                if (user) {
                    return this.firebaseData.getWallets(user.uid);
                }
            },
            (error) => {
                return Observable.throw(error);
            });
        }

    }

    public getWalletByEmail(email: string): Observable<any> {
        return this.firebaseData.getWalletByEmail(email)
            .first()
            .flatMap((userData) => {
                let wallet = (userData[0].wallet ? Object.values(userData[0].wallet) : null)[0];
                return this.restService.getWalletAddresses(wallet.name);
            })
            .catch((error) => {
                return Observable.throw(error);
            });
    }

    public isAddressSaved(email: string): Observable<any> {
        return this.firebaseData.getAddressFromAddressBook(this.user.uid, email);
    }

    public addressExist(email: string): Observable<any> {
        if (email !== this.user.email) {
        return this.firebaseData.getWalletByEmail(email)
            .map((data) => {
                if (data.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }, (error) => {
                return Observable.throw(error);
            });
        } else {
            return Observable.throw( new ErrorService(null, 'SAME_USER'));
        }
    }

    public addAddress(form: FormGroup) {
        this.firebaseData.addAddressToAddressBook(this.user.uid, form.value);
    }

    public sendPayment(transaction: ITransactionSke) {
        if (this.wallet) {
            const trx = this.keyService.signWithPrivKey(transaction, this.wallet.keys);
            this.restService.sendPayment(trx)
                .subscribe((response) => {
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
        }
    }
}
