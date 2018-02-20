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
import { AppData } from '../app.data';

@Injectable()

export class AuthService {
    public user: User;
    public wallets: Wallet[];

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider, private events: Events,
                private restService: RestService, private keyService: KeyService) {
        this.firebaseAuth.authState.first()
            .subscribe((user) => {
                if (user) {
                    this.user = this.getLoggedUser(user);
                    this.getWalletsAsync().subscribe((wallets) => {
                        this.wallets = wallets;
                    });
                } else {
                    this.logout();
                }
            });
    }

    // Login / Sign Up Functions

    // Creates a new user with Firebase Auth using the Email and Password Provider ***
    public signup(user: FormGroup) {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password)
                .then((response) => {
                    // Stores the user email on Firebase Realtime DB
                    this.firebaseData.addUser(response.email, response.uid);
                    resolve(response);
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
                .then((response) => {
                    this.firebaseData.addUser(response.email, response.uid);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // Creates a new wallet for a logged User
    public createWallet(crypto, passphrase): Promise<Wallet> {
        return new Promise((resolve, reject) => {
            // We create the crypto information according to the currency selected
            const keys = this.keyService.createKeys(crypto, passphrase);
            const data = {
                name: crypto + this.user.uid.substring(0, 21),
                extended_public_key: keys.xpub,
            };
            // The unit of the coin is by default the smallest one
            const currency = AppData.cryptoUnitList.filter((c) => {
                return c.value.includes(crypto);
            }).pop();
            currency.units = currency.units.pop();
            // We send the info to the BlockCypher API
            this.restService.createWalletHD(data, crypto)
                .subscribe((hdWallet) => {
                    // Succeed Creating the Wallet, so now we need to store the info on Firebase
                    const newWallet = new Wallet(hdWallet.name, keys, currency);
                    this.firebaseData.addWallet(newWallet, this.user.uid);
                    resolve(newWallet);
                },
                    (error) => {
                        reject(error);
                    });
        });
    }

    // Logs out the current user
    public logout() {
        this.firebaseAuth.auth.signOut();
        this.updateUser();
        this.events.publish('user:loggedOut');
    }

    // Verifies the Email associated with the user (only email and password provider)
    public sendVerificationEmail() {
        return this.firebaseAuth.auth.currentUser.sendEmailVerification();
    }

    // Restores the password by sending an email to the user (only email and password provider)
    public restorePassword() {
        const user = firebase.auth().currentUser;
        return firebase.auth().sendPasswordResetEmail(user.email);
    }

    // CRUD Operations that require information from the user

    // Creates the user object from the Auth Service for use on the App
    public getLoggedUser(user: firebase.User) {
        this.user = new User(user.uid, user.email, user.emailVerified, user.phoneNumber, user.photoURL);
        return this.user;
    }

    // Updates the user object from the Auth Service for use on the App
    public updateUser() {
        this.user = this.getLoggedUser(firebase.auth().currentUser);
    }

    // Gets the latest Balance from the User Wallets ***
    public updateBalances(): Observable<any> {
        const balances: Array<Observable<any>> = [];
        return this.getWalletsAsync()
            .first()
            .flatMap((wallets) => {
                // If the user has wallets, we return the balances
                if (wallets.length > 0) {
                    wallets.forEach((wallet) => {
                        balances.push(this.updateBalance(wallet));
                    });
                    return Observable.combineLatest(balances);
                } else {
                    // The user is new, and has not created a wallet yet
                    const error = new ErrorService(null, 'NO_WALLET');
                    return Observable.throw(error);
                }
            })
            .catch((error) => {
                // Error either accessing the Firebase Service or with the Rest Service
                console.log(error);
                return Observable.throw(error);
            });
    }

    // Returns an IBalance object from a single Wallet
    public updateBalance(wallet: Wallet): Observable<IBalance> {
        return this.restService.getBalanceFromWallet(wallet);
    }

    // Returns an observable with all of the user wallets ***
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

    // Returns another app user wallet information *** NO MULTI WALLET IMPLEMENTATION
    public getWalletByEmail(email: string, coin: string): Observable<any> {
        return this.firebaseData.getWalletByEmail(email, coin)
            .first()
            .flatMap((wallet) => {
                if (wallet) {
                    return this.restService.deriveAddress(wallet, coin);
                } else {
                    const error = new ErrorService(null, 'NO_WALLET_FOR_SELECTED_CRYPTO');
                    return Observable.throw(error);
                }
            })
            .catch((error) => {
                console.log(error);
                return Observable.throw(error);
            });
    }

    // Checks the user Address Book for duplicate values
    public isAddressSaved(email: string): Observable<any> {
        return this.firebaseData.getAddressFromAddressBook(this.user.uid, email);
    }

    // Checks the application database to see if a user exists ***
    public addressExist(email: string): Observable<any> {
        if (email !== this.user.email) {
            return this.firebaseData.getUserByEmail(email)
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
            return Observable.throw(new ErrorService(null, 'SAME_USER'));
        }
    }

    // Adds another user to the user Address Book
    public addAddress(form: FormGroup) {
        this.firebaseData.addAddressToAddressBook(this.user.uid, form.value);
    }

    // Function for signing an ITransactionSke, needed for Sending money (Payments) ***
    public sendPayment(transaction: ITransactionSke, wallet: IHDWallet): Observable<any> {
        if (this.wallets) {
            const signingWallet = this.wallets.find((w) => {
                return (w.name === wallet.name);
            });
             // The transaction Skeleton is incomplete, we need to add pub keys and sign the data
            const trx = this.keyService.signWithPrivKey(transaction, signingWallet.keys);
            return this.restService.sendPayment(trx, wallet.crypto.value)
            .map((response) => {
                // The transaction was Created Succesfully
                return response;
            }).catch((error) => {
                console.log(error);
                return error;
            });
    }
        }

}
