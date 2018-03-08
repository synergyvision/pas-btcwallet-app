import { Injectable } from '@angular/core';
import { IBalance } from '../models/IBalance';
import { Wallet } from '../models/wallet';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { ErrorService } from './error.service';
import { EventService } from './events.services';
import { FormGroup } from '@angular/forms';
import { ITransactionSke } from '../models/ITransaction';
import { IHDWallet } from '../models/IHDWallet';
import { KeyService } from './key.service';
import { AppData } from '../app.data';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Events } from 'ionic-angular';
import { IKeys } from '../models/IKeys';
import { ExchangeService } from './exchange.service';
import { IExchange } from '../models/IExchange';

@Injectable()

export class SharedService {
    public balances: IBalance[];
    public user: User;
    public wallets: Wallet[];
    public currency;

    constructor(public firebaseData: FirebaseProvider, public restService: RestService, public events: Events,
                public eventService: EventService, public keyService: KeyService, public authService: AuthService,
                public exchangeService: ExchangeService) {
        this.events.subscribe('user:loggedOut', () => {
            this.setUser(this.authService.getLoggedUser());
            this.wallets = undefined;
            this.balances = undefined;
        });
        this.events.subscribe('user:loggedIn', () => {
            this.setUser(this.authService.getLoggedUser());
            this.getWalletsAsync().subscribe((wallets) => {
                this.setWallets(wallets);
            });
            this.getCurrency();
        });
        this.events.subscribe('user:changedData', () => {
            this.updateUser();
        });
    }

    public setUser(user: User) {
        this.user = user;
    }

    public setWallets(wallets: Wallet[]) {
        this.wallets = wallets;
    }

    public updateUser() {
        this.user = this.authService.getLoggedUser();
    }

    public setBalances(balances) {
        Observable.combineLatest(balances).subscribe((data: IBalance[]) => {
            this.balances = this.formatBalanceData(data);
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
            if ((crypto !== 'tet') && (crypto !== 'eth')) {
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
            } else {
                const address = this.keyService.generateAddress(keys);
                const newWallet = new Wallet(data.name, keys, currency);
                newWallet.address = address;
                this.firebaseData.addWallet(newWallet, this.user.uid);
                resolve(newWallet);
            }
        });
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
                    this.setBalances(balances);
                    return Observable.combineLatest(balances);
                } else {
                    // The user is new, and has not created a wallet yet
                    const error = new ErrorService(null, 'NO_WALLET');
                    return Observable.throw(error);
                }
            })
            .catch((error) => {
                // Error either accessing the Firebase Service
                return Observable.throw(error);
            });
    }

    // Returns an IBalance object from a single Wallet
    public updateBalance(wallet: Wallet): Observable<IBalance> {
        if (wallet.crypto.value === 'eth' || wallet.crypto.value === 'tet') {
            return this.restService.getEthereumBalance(wallet);
        } else {
            return this.restService.getBalanceFromWallet(wallet);
        }
    }

    // Returns an observable with all of the user wallets ***
    public getWalletsAsync(): Observable<any> {
        if (this.user) {
            return this.firebaseData.getWallets(this.user.uid);
        }
    }

    // Returns another app user wallet information *** NO MULTI WALLET IMPLEMENTATION
    public getWalletByEmail(email: string, coin: string): Observable<any> {
        return this.firebaseData.getWalletByEmail(email, coin)
            .first()
            .flatMap((wallet) => {
                if (wallet.address) {
                    return Observable.of(wallet.address);
                }
                if (wallet.name) {
                    return this.restService.deriveAddress(wallet.name, coin);
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
            return this.firebaseData.getWalletsKeys(this.user.uid, signingWallet.key)
            .first()
            .flatMap((keys) => {
                signingWallet.keys = keys;
                const trx = this.keyService
                .signWithPrivKey(transaction, signingWallet.keys, signingWallet.crypto.value);
                return this.restService.sendPayment(trx, wallet.crypto.value)
                .map((response) => {
                    // The transaction was Created Successfully
                    return response;
                }).catch((error) => {
                    console.log(error);
                    return error;
                });
            });
        }
    }

    // User preferences

    public updateWalletCryptoUnit(wallet: Wallet): Promise<any> {
        return this.firebaseData.updateWalletCrypto(wallet, this.user.uid);
    }

    public getWalletWIF(wallet: Wallet): Observable<string> {
        return this.firebaseData.getWalletsKeys(this.user.uid, wallet.key)
        .map((keys: IKeys) => {
            return this.keyService.getWIF(keys, wallet.crypto.value);
        });
    }

    public getWalletMnemonics(wallet: Wallet): Observable<string> {
        return this.firebaseData.getWalletsKeys(this.user.uid, wallet.key)
        .map((keys: IKeys) => {
            return keys.mnemonics;
        });
    }

    public walletEventCreation(wallets: Wallet[]) {
       wallets.forEach((wallet) => {
            this.eventService.createTXConfirmationEvent(wallet.name);
        });
    }

    public getCurrency() {
        this.firebaseData.getCurrency(this.user.uid)
        .subscribe((currency) => {
            this.currency = currency;
        });
    }
/* 
    public getCurrencyExchange() {
    } */

    // Transform the data that is going to be shown on the views
    public formatBalanceData(balances: IBalance[]): IBalance[] {
        balances.forEach((balance) => {
            balance.balance = parseFloat(balance.balance.toFixed(2));
        });
        return balances;
    }

    public getExchangePair(input: string, output: string): string{
        const input_pair = AppData.exchangePairs.filter((p) => {
            return p.crypto === input;
        }).pop().name;
        const output_pair = AppData.exchangePairs.filter((p) => {
            return p.crypto === output;
        }).pop().name;
        return input_pair + '_' + output_pair;
    }

    public getExchangeRate(input: string, output: string): Observable<IExchange> {
        const pair = this.getExchangePair(input, output);
        return this.exchangeService.getExchangeRate(pair);
    }
}
