import { IKeys } from '../models/IKeys';
import { KeyService } from './key.service';
import { Wallet } from '../models/wallet';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { EventService } from './events.services';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { IToken, User } from '../models/user';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { ExchangeService } from './exchange.service';
import { IMSWalletRequest, IPendingTxs, ISigner, MultiSignedWallet } from '../models/multisignedWallet';
import { Address } from '../models/address';
import { AppData } from '../app.data';
import { Activity } from '../models/activity';
import { StorageProvider } from '../../providers/firebase/storage';
import { IBalance } from '../interfaces/IBalance';
import { IHDWallet } from '../interfaces/IHDWallet';
import { ITransactionSke } from '../interfaces/ITransactionSke';
import { IAddress } from '../interfaces/IAddress';
import { ActivityService } from './activity.service';
import { AppConstants } from '../../config/appConstants';

const TOKEN = AppConstants.CRYPTO_API_TOKEN;

@Injectable()

/*
This service handles the passing of data to other services
Since it is a singleton, it also has global data to be accessed by the components and pages of the APP
Does multiple REST calls to access information, since most of the data is on APIs
*/
export class SharedService {
    // Global Data to be used on the APP
    // The data of the user
    public user: User;
    // The user Wallet(s)
    public wallets: Wallet[];
    // Specific data about the MultiSigned Wallets
    public multiSignedWallets: MultiSignedWallet[];
    // The balance(s) of the user wallet(s)
    public balances: IBalance[];
    // The user preferred Currency
    public currency: string;
    public exchange: {
        currency: string,
        exchange: number,
    };
    // The user Pending Transactions (MultiSigned Wallet)
    public pendingTxs;

    constructor(public firebaseData: FirebaseProvider, public restService: RestService, public events: Events,
                public eventService: EventService, public keyService: KeyService, public authService: AuthService,
                public exchangeService: ExchangeService, public storageProvider: StorageProvider, 
                public activityService: ActivityService) {
        // We create a listener on the auth state
        this.events.subscribe('user:loggedOut', () => {
            this.user = this.wallets = this.balances =
            this.multiSignedWallets = undefined;
        });
        // We get all of the logged user information
        this.events.subscribe('user:loggedIn', () => {
            this.setUser(this.authService.getLoggedUser());
        });
        this.events.subscribe('user:changedData', () => {
            this.updateUser();
        });
    }

    // Setters

    public setUser(user: User) {
        if (user !== undefined) {
            this.user = user;
            this.getWalletsAsync()
                    .subscribe((wallets) => {
                        this.setWallets(wallets);
                    });
            this.getCurrency();
            this.getToken();
        }
    }

    public getCurrency() {
        this.firebaseData.getCurrency(this.user.uid)
        .subscribe((currency) => {
            this.currency = currency;
        });
    }

    public getCurrencyExchange(balances: IBalance[]): Promise<IBalance[]> {
        return new Promise((resolve, reject) => {
            return this.exchangeService.getCryptoExchange(this.currency)
                .subscribe((exchange) => {
                    balances.forEach((balance) => {
                        balance.exchange = exchange.find((e) => {
                            return e.crypto === balance.wallet.crypto.coin;
                        }).exchange;
                    });
                    this.balances = balances;
                    resolve(balances);
                }, ((error) => {
                    reject(error);
                }));
            });
    }

    public getToken() {
        this.firebaseData.getToken(this.user.uid)
        .subscribe((token) => {
            this.user.token = token;
        });
    }

    public walletEventCreation(wallets: Wallet[]) {
        wallets.forEach((wallet) => {
            this.eventService.createTXConfirmationEvent(wallet.name);
        });
    }


    // WIP
    public changePicture(select: boolean): Promise<any> {
        let photoURL: Promise<any>;
        if (select) {
           photoURL = this.storageProvider.selectProfileImage(this.user.email);
        } else {
           photoURL = this.storageProvider.takeProfileImage(this.user.email);
        }
        return photoURL;
    }

    //FINWIP

    public setWallets(wallets: Wallet[]) {
        this.wallets = wallets;
        this.multiSignedWallets = [];
        wallets.forEach((wallet) => {
            if (wallet.multiSignedKey !== '') {
                this.firebaseData.getMultiSignedWallet(wallet.multiSignedKey)
                    .subscribe((mSWallet: MultiSignedWallet) => {
                        this.multiSignedWallets.push(mSWallet);
                    });
            }
        });
        this.pendingTxs = this.getPendingTx();
    }

    public showNotification() {
        if (this.pendingTxs) {
            this.pendingTxs.subscribe((data) => {
                if (data.length > 0) {
                    console.log('UPDATE');
                } else {
                    console.log('NO');
                }
            });
        }
    }

    public getPendingTx(): Observable<IPendingTxs[]> {
        return this.firebaseData.getPendingTrx(this.user.uid)
        .map((pending) => {
            return pending.filter((tx) => {
                // We verify that the Tx has not expired
                if (this.validPendingTx(tx)) {
                    if (tx.dismissed !== undefined) {
                        return (!tx.dismissed.includes(this.user.email) &&
                            (!tx.approved.includes(this.user.email)));
                    } else if (!tx.approved.includes(this.user.email)) {
                        return tx;
                    }
                // The Request has expired, and we delete it from the Firebase Database
                } else {
                    this.firebaseData.deletePendingTrx(tx.key);
                }
            });
        });
    }

    public getWalletPendingTx(wallet: string): Observable<IPendingTxs[]> {
        return this.firebaseData.getWalletPendingTrx(wallet);
    }

    public validPendingTx(tx: IPendingTxs): boolean {
        const time = new Date().getTime() - new Date(tx.createdDate).getTime();
        return (time < 604800000);
    }

    public updateUser() {
        this.user = this.authService.getLoggedUser();
        this.setUser(this.user);
    }

    public getWalletSigners(signers: ISigner[]): Observable<Address[]> {
        const email: string[] = signers.map((signer) => {
            return signer.email;
        });
        return this.firebaseData.getAddressBook(this.user.uid)
        .map((users: Address[]) => {
            return users.filter((user) => {
                return email.includes(user.email);
            });
        });
    }

    public getRequests(): Observable<IMSWalletRequest[]> {
        return this.firebaseData.getMultiSignedWalletRequest(this.user.uid)
        .map((requests) => {
            return requests.filter((request) => {
                return !request.accepted.includes(this.user.email);
            });
        });
    }

    public getMultiSignedWallet(key: string) {
        return this.multiSignedWallets.find((w) => {
            return (w.key === key);
        });
    }

     // User preferences

    public updateWalletCryptoUnit(wallet: Wallet): Promise<any> {
        return this.firebaseData.updateWalletCrypto(wallet, this.user.uid);
    }

    public updateCurrency(currency: string): Promise<any> {
        return this.firebaseData.updateCurrency(this.user.uid, currency);

    }

    public getWalletMnemonics(wallet: Wallet): Observable<string> {
        return this.firebaseData.getWalletsKeys(this.user.uid, wallet.key)
            .map((keys: IKeys) => {
                return keys.mnemonics;
            });
    }

    // Home Functions, they are required when the user logs in

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
                    return Observable.throw('NO_WALLET');
                }
            })
            .catch((error) => {
                // Error either accessing the Firebase Service
                return Observable.throw(error);
            });
    }

    // Returns an IBalance object from a single Wallet
    public updateBalance(wallet): Observable<any> {
        if (wallet.address !== '') {
            return this.restService.getAddressWalletBalance(wallet);
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

    // Address Book Functions

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
                        return data;
                    } else {
                        return false;
                    }
                }, (error) => {
                    return Observable.throw(error);
                });
        } else {
            return Observable.throw('ERROR.same_user_message');
        }
    }

    // Adds another user to the user Address Book
    public addAddress(address: Address) {
        this.firebaseData.addAddressToAddressBook(this.user.uid, address);
    }

    // Wallet Creation

    // Creates a new wallet for a logged User

    public saveWallet(keys: IKeys, crypto: string): Promise<Wallet> {
        return new Promise((resolve, reject) => {
            // The unit of the coin is by default the smallest one
            const currency = AppData.cryptoUnitList.filter((c) => {
                return c.value.includes(crypto);
            }).pop();
            currency.units = currency.units.pop();
            const data = {
                name: crypto + this.createRandomUUID(this.user.uid),
                extended_public_key: keys.xpub,
            };
           // We send the info to the BlockCypher API
            if ((crypto !== 'tet') && (crypto !== 'eth')) {
                this.restService.createWalletHD(data, crypto)
                    .subscribe((hdWallet) => {
                        // Succeed Creating the Wallet, so now we need to store the info on Firebase
                        const newWallet = new Wallet(hdWallet.name, keys, currency);
                        this.firebaseData.addWallet(newWallet, this.user.uid);
                        resolve(newWallet);
                    }, (error) => {
                        reject(error);
                });
            } else {
                console.log('hgere');
                const address = this.keyService.generateAddress(keys);
                const newWallet = new Wallet(data.name, keys, currency);
                newWallet.address = address;
                this.firebaseData.addWallet(newWallet, this.user.uid);
                resolve(newWallet);
            }
        });
    }
    public createWallet(crypto, passphrase): Promise<Wallet> {
        const keys = this.keyService.createKeys(crypto, passphrase);
        console.log(crypto);
        return this.saveWallet(keys, crypto);
    }

    // WIP

    public importWalletMnemonics(mnemonics: string, crypto: string, passphrase?: string) {
        const keys = this.keyService.importWalletMnemonics(mnemonics, crypto, passphrase);
        return this.saveWallet(keys, crypto);
    }

    // Functions for creating and sending Payments

    // Returns another app user wallet information *** NO MULTI WALLET IMPLEMENTATION
    public getWalletByEmail(email: string, coin: string, multiSignedKey: string): Observable<any> {
        return this.firebaseData.getWalletByEmail(email, coin, multiSignedKey)
            .first()
            .flatMap((wallet) => {
                if (wallet !== undefined) {
                    if (wallet.address) {
                        return Observable.of(wallet.address);
                    }
                    if (wallet.name) {
                        return this.restService.deriveAddress(wallet.name, coin);
                    }
                } else {
                    return Observable.throw('ERROR.no_wallet_for_crypto_message');
                }
            })
            .catch((error) => {
                console.log(error);
                return Observable.throw(error);
            });
    }

    // Creates a Pending Transaction to be signed by the user(s)

    public createPayment(address: string, amount: number, wallet: IHDWallet, fee: string) {
        let data: {};
        console.log(wallet);
        // MultiSigned Wallets
        if (wallet.multiSignedKey !== '' && wallet.multiSignedKey !== undefined) {
            const mSWallet = this.getMultiSignedWallet(wallet.multiSignedKey);
            const addresses = [];
            mSWallet.signers.forEach((signer) => {
                addresses.unshift(signer.pubKey);
            });
            console.log(fee);
            data = JSON.stringify({
                inputs: [{
                    addresses: addresses,
                    script_type: mSWallet.type,
                }],
                outputs: [{
                    addresses: [
                        address,
                    ],
                    value: Number(amount),
                }],
                preference: fee,
            });
        // Ethereum and Ethereum Testnet Wallets
        } else if ((wallet.address !== '' && wallet.address !== undefined) &&
        ((wallet.crypto.value === 'tet') || (wallet.crypto.value === 'bet'))) {
            data = JSON.stringify({
                inputs: [{
                    addresses: [
                        wallet.address,
                    ],
                }],
                outputs: [{
                    addresses: [
                        address,
                    ],
                    value: Number(amount),
                }],
            });

        // HD Wallets
        } else {
            data = JSON.stringify({
                inputs: [{
                    wallet_name: wallet.name,
                    wallet_token: TOKEN,
                }],
                outputs: [{
                    addresses: [
                        address,
                    ],
                    value: Number(amount),
                }],
                preference: fee,
            });
        }
        console.log(data);
        return this.restService.createPayment(data, wallet.crypto.value);
    }

    // Function for signing an ITransactionSke, needed for Sending money (Payments) ***
    public sendPayment(transaction: ITransactionSke, wallet: IHDWallet): Observable<any> {
        const signingWallet = this.wallets.find((w) => {
            return (w.name === wallet.name);
        });
        if (wallet.multiSignedKey !== '') {
            return this.createPendingTrx(transaction, signingWallet);
        } else {
            return this.signNormalPayment(transaction, signingWallet);
        }
    }

    public signNormalPayment(transaction: ITransactionSke, wallet: Wallet): Observable<ITransactionSke> {
        return this.firebaseData.getWalletsKeys(this.user.uid, wallet.key)
            .first()
            .flatMap((keys) => {
                wallet.keys = keys;
                const trx = this.keyService
                    .signTransaction(transaction, wallet.keys, wallet.crypto.value);
                return this.restService.sendPayment(trx, wallet.crypto.value);
            });
    }

    // MultiSigned Wallets Functions

    // We create the MultiSigned Walled Request for the other users on the App

    public createMultisignWalletRequest(data: any, users: ISigner[]): Observable<any> {
        const request: IMSWalletRequest = {};
        request.createdBy = this.user.email;
        request.crypto = data.selectedCrypto;
        users.push({uid: this.user.uid, email: this.user.email});
        request.users = request.signers = users;
        request.accepted = [];
        request.accepted.push(this.user.email);
        request.type = 'multisig-' +  data.numberOfSignatures + '-of-' + data.numberOfSigners;
        return this.addMultiSignedWalletRequest(request);
    }

    public rejectMultiSignedWalletRequest(request: IMSWalletRequest) {
        return new Promise((resolve, reject) => {
            this.firebaseData.deleteMultiSignedWalletRequest(request).
            then((deleted) => {
                /* const rejectedWallet = new Activity(Date.toString(),
                'El usuario' + this.user.email + 'rechazo su solicitud de billetera multifirmada');
                this.firebaseData.getUserByEmail(request.createdBy)
                .subscribe((user) => {
                    this.firebaseData.addActivity(user.pop().key, rejectedWallet);
                }); */
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    public addMultiSignedWalletRequest(request: IMSWalletRequest): Observable<any> {
        request.signers = Object.assign({}, ...request.signers.map((key) => {
                return {[key.uid] : true};
        }));
        console.log(request);
        return Observable.of(this.firebaseData.addMultiSignedWalletRequest(request));
    }

    public acceptMultiSignedWalletRequest(request: IMSWalletRequest) {
        request.accepted.push(this.user.email);
        if (Object.keys(request.signers).length === request.accepted.length) {
            this.firebaseData.deleteMultiSignedWalletRequest(request)
            .then(() => {
                this.createMultisignWallet(request);
            });
        } else {
            this.firebaseData.updateMultiSignedWalletRequest(request);
        }
    }

    public createMultisignWallet(request: IMSWalletRequest) {
        // Emails were verified before
        return new Promise((resolve, reject) => {
            console.log(request);
            // First we create the new Wallet Data
            const name = 'MS' + request.crypto  + Math.random().toString(36).substr(2, length);
            const script = request.type;
            const currency = AppData.cryptoUnitList.filter((c) => {
                return c.value.includes(request.crypto);
            }).pop();
            currency.units = currency.units.pop();
            // We create the Keys for every Signer
            const keys = this.keyService.createMultiSignedKeys(request.users.length, request.crypto);
            console.log(keys);
            const pubKeys: string[] = [];
            request.users.forEach((user) => {
                user.pubKey = keys.shift();
                pubKeys.unshift(user.pubKey.xpub);
            });
            console.log(request.users);
            const signers = JSON.parse(JSON.stringify(request.users)) as ISigner[];
            // if ((request.crypto !== 'tet') && (request.crypto !== 'eth')) {
            this.restService.createMultiSignedAddress(request.crypto, pubKeys, script)
            .first()
            .subscribe((address: IAddress) => {
                const newWallet = new MultiSignedWallet(name, currency, signers, script, address.address);
                const key = this.firebaseData.addMultiSignedWallet(newWallet, request.users);
                resolve(newWallet);
            },
            (error) => {
                console.log(error);
                reject(error);
            });
        });
    }


    public createPendingTrx(transaction: ITransactionSke, wallet: Wallet) {
        console.log('We create the Pending TRX');
        const msWallet = this.getMultiSignedWallet(wallet.multiSignedKey);
        const pendingTrx: IPendingTxs = {};
        pendingTrx.tx = transaction;
        pendingTrx.to = transaction.tx.outputs.pop().addresses.pop();
        pendingTrx.createdBy = this.user.email;
        pendingTrx.createdDate = new Date().toDateString();
        pendingTrx.wallet = wallet.multiSignedKey;
        pendingTrx.amount = transaction.tx.total;
        pendingTrx.approved = [];
        pendingTrx.dismissed = [];
        pendingTrx.signers = Object.assign({}, ...msWallet.signers.map((key) => {
            return {[key.uid] : true};
        }));
        console.log(pendingTrx);
        return this.acceptPendingTrx(pendingTrx, wallet, msWallet, true);
    }

    // Accepts and sends the Transaction Signed by the User
    public acceptPendingTrx(pendingTrx: IPendingTxs, wallet?: Wallet, msWallet?: MultiSignedWallet,
                            newTx?: boolean): Observable<any> {
        if (wallet === undefined && msWallet === undefined) {
            msWallet = this.getMultiSignedWallet(pendingTrx.wallet);
            wallet = this.wallets.find((w) => {
                return (w.multiSignedKey === msWallet.key);
            });
        }
        return this.firebaseData.getWalletsKeys(this.user.uid, wallet.key)
        .first()
        .flatMap((key) => {
            console.log('SO now we sign our transaction');
            const trx = this.keyService.signWithPrivateKey(pendingTrx.tx, key, wallet.crypto.value);
            pendingTrx.approved.push(this.user.email);
            return this.restService.sendPayment(trx, wallet.crypto.value)
            .flatMap((data) => {
                console.log('Signed');
                console.log(data);
                console.log('Hash');
                console.log(data.tx.hash);
                console.log(pendingTrx.tx.tx.hash);
                if (pendingTrx.approved.length === (Number(msWallet.type.replace('multisig-', '').slice(0, 1)))) {
                    // Transaction was approved by the minimun number of signers
                    this.cancelPendingTrx(pendingTrx.key);
                } else if (newTx) {
                    // pendingTrx.tx.tx.hash = data.tx.hash;
                    this.firebaseData.addPendingTrx(pendingTrx);
                } else {
                    this.firebaseData.updatePendingTrx(pendingTrx);
                }
                return Observable.of(pendingTrx.tx);
            })
            .catch((error) => {
                console.log(error);
                return Observable.throw('ERROR.unknown');
            });
        })
        .catch((error) => {
            console.log(error);
            return Observable.throw(error);
        });
    }

    // For Canceling the Pending TRX (on Cases where the MultisignedWallet handles rejection)
    public cancelPendingTrx(pendingTrx: string) {
        return this.firebaseData.deletePendingTrx(pendingTrx);
    }

    // For dismissing the PendingTrx Notificaction
    public dismissPendingTrx(pendingTrx: IPendingTxs) {
        if (pendingTrx.dismissed === undefined) {
            pendingTrx.dismissed = [];
        }
        pendingTrx.dismissed.push(this.user.email);
        this.firebaseData.updatePendingTrx(pendingTrx);
    }

    private createRandomUUID(seed: string): string {
        return (  Math.random().toString(36).substring(2) + seed).substring(0, 21);
    }
}
