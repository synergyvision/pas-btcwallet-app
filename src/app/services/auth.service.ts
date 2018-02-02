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
import { ITransacionSke } from '../models/ITransaction';

@Injectable()
export class AuthService {
    public user: User;
    public wallet: Wallet;
    public balance: Observable<IBalance>;

    constructor(private firebaseAuth: AngularFireAuth, private firebaseData: FirebaseProvider, private events: Events,
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
                    this.logout();
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
                console.log('ERROR ON CREATE USER' + error);
                reject(error);
            });
        });
    }

    public login(email: string, password: string) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    public loginGoogle() {
        const response = this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        // this.user.sendEmailVerification();
        return response;
        // Verify the wallet
    }
    public logout() {
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

    public getWalletsAsync() {
        return this.firebaseData.getWallets(this.user.uid);
    }

    public getWalletAddress(email: string): Observable<any> {
        return this.firebaseData.getWalletByEmail(email)
        .first()
        .flatMap((userData) => {
            let wallet = (userData[0].wallet ? Object.values(userData[0].wallet) : null)[0];
            console.log(wallet);
            return this.restService.deriveAddress(wallet.name);
        })
        .catch((error) => {
            console.log('ERROR ON CREATE USER' + error);
            return Observable.throw(error);
        });
    }

    public signTransaction(transaction: ITransacionSke) {
        if (this.wallet) {
            console.log(this.keyService.signWithPrivKey(transaction, this.wallet.keys));
        }
    }
}
