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
                this.getWalletsAsync().subscribe((wallet) => {
                    this.wallet = wallet[0];
                });
            } else {
                this.logout();
            }
        });
    }

    // Login / Sign Up Functions

    public signup(user: FormGroup) {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.createUserWithEmailAndPassword(user.value.email, user.value.password)
            .then((response) => {
            // HD Wallets
                resolve(this.createData(response));
            })
            .catch((error) => {
                this.firebaseAuth.auth.currentUser.delete();
                reject(error);
             });
        });
    }

    public loginGoogle() {
        return new Promise((resolve, reject) => {
            this.firebaseAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            .then((response) => {
                if (response.additionalUserInfo.isNewUser) {
                    resolve(this.createData(response));
                } else {
                    resolve(response);
                }
            })
            .catch((error) => {
                this.firebaseAuth.auth.currentUser.delete();
                reject(error);
            });
        });
    }

    public createData(response) {
        return new Promise((resolve, reject) => {
            const keys = this.keyService.createKeys();
            const data = {
                name: 'HDW' + response.uid.substring(0, 22),
                extended_public_key: keys.xpub,
            };
            this.restService.createWalletHD(data)
                .subscribe((hdWallet) => {
                    const newWallet = new Wallet(hdWallet.name, keys);
                    this.firebaseData.addWallet(newWallet, response.uid);
                    this.firebaseData.addUser(response.email, response.uid);
                    this.logout();
                    resolve(response);
                },
                (error) => {
                    this.firebaseAuth.auth.currentUser.delete();
                    reject(error);
                });
        });
    }

    public login(email: string, password: string) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    public logout() {
        this.firebaseAuth.auth.signOut();
        this.updateUser();
        this.events.publish('user:loggedOut');
    }

    public sendVerificationEmail() {
        return this.firebaseAuth.auth.currentUser.sendEmailVerification();
    }

    public restorePassword() {
        const user = firebase.auth().currentUser;
        return firebase.auth().sendPasswordResetEmail(user.email);
    }

    // CRUD Operations that require information from the user

    public getLoggedUser(user: firebase.User) {
        this.user = new User(user.uid, user.email, user.emailVerified, user.phoneNumber, user.photoURL);
        return this.user;
    }

    public updateUser() {
        this.user = this.getLoggedUser(firebase.auth().currentUser);
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

    public sendPayment(transaction: ITransactionSke): Observable<any> {
        if (this.wallet) {
            // The transaction Skelleton is incomplete, we need to add pub keys and sign the data
            const trx = this.keyService.signWithPrivKey(transaction, this.wallet.keys);
            return this.restService.sendPayment(trx)
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
