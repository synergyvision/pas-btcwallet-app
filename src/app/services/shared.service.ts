import { KeyService } from './key.service';
import { Injectable } from '@angular/core';
import { Wallet } from '../models/wallet';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { EventService } from './events.services';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { User, IToken } from '../models/user';
import { Events } from 'ionic-angular';
import { IKeys } from '../models/IKeys';
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

const TOKEN = '6947d4107df14da5899cb2f87a9bb254';
@Injectable()

export class SharedService {
    public balances: IBalance[];
    public user: User;
    public wallets: Wallet[];
    public multiSignedWallets: MultiSignedWallet[];
    public currency;
    public requestList;
    public requestNumber: number;
    public pendingTxs;

    constructor(public firebaseData: FirebaseProvider, public restService: RestService, public events: Events,
                public eventService: EventService, public keyService: KeyService, public authService: AuthService,
                public exchangeService: ExchangeService, public storageProvider: StorageProvider) {
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

    public getToken() {
        this.firebaseData.getToken(this.user.uid)
        .subscribe((token) => {
            this.user.token = token;
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
        return photoURL.then((url) => {
            this.user.setPhotoURL(url);
            this.authService.user.updateProfile({
            displayName: this.user.displayName,
            photoURL : this.user.photoURL,
            });
            this.firebaseData.updateProfilePicture(this.user.uid, url);
        })
        .catch((error) => {
            console.log(error);
        });
    }

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
                    // (this.validPendingTx(tx));
                    console.log(!tx.approved.includes(this.user.email));
                    if (tx.dismissed !== undefined) {
                        return (!tx.dismissed.includes(this.user.email) &&
                            (!tx.approved.includes(this.user.email)));
                    } else if (!tx.approved.includes(this.user.email)) {
                        console.log(tx);
                        return tx;
                    }
                // }
            });
        });
    }

    public getWalletPendingTx(wallet: string): Observable<IPendingTxs[]> {
        return this.firebaseData.getWalletPendingTrx(wallet);
    }

    public validPendingTx(tx: IPendingTxs): boolean {
        console.log(tx);
        console.log(tx.createdDate.getTime());
        const time = new Date().getTime() - tx.createdDate.getTime();
        console.log(time);
        // return (time < 604800000);
        return true;
    }

    public updateUser() {
        this.user = this.authService.getLoggedUser();
        this.setUser(this.user);
    }

    public getWalletSigners(signers: ISigner[]): Observable<Address[]> {
        console.log(signers);
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

    // WIP

    public getCurrency() {
        this.firebaseData.getCurrency(this.user.uid)
            .subscribe((currency) => {
                this.currency = currency;
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

    public setBalances(balances) {
        Observable.combineLatest(balances).subscribe((data: IBalance[]) => {
            this.balances = this.formatBalanceData(data);
        }, (error) => {
            console.log(error);
        });
    }

    public getMultiSignedWallet(key: string) {
        return this.multiSignedWallets.find((w) => {
            return (w.key === key);
        });
    }

    // Transform the data that is going to be shown on the views

    public formatBalanceData(balances: IBalance[]): IBalance[] {
        balances.forEach((balance) => {
            balance.balance = parseFloat(balance.balance.toFixed(2));
        });
        return balances;
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
                    this.setBalances(balances);
                    return Observable.combineLatest(balances);
                } else {
                    // The user is new, and has not created a wallet yet
                    return Observable.throw('NO_WALLET');
                }
            })
            .catch((error) => {
                console.log(error);
                // Error either accessing the Firebase Service
                return Observable.throw(error);
            });
    }

    // Returns an IBalance object from a single Wallet
    public updateBalance(wallet): Observable<IBalance> {
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

    // Functions for creating and sending Payments

    // Returns another app user wallet information *** NO MULTI WALLET IMPLEMENTATION
    public getWalletByEmail(email: string, coin: string, multiSignedKey: string): Observable<any> {
        return this.firebaseData.getWalletByEmail(email, coin, multiSignedKey)
            .first()
            .flatMap((wallet) => {
                console.log(wallet);
                if (wallet.address) {
                    return Observable.of(wallet.address);
                }
                if (wallet.name) {
                    return this.restService.deriveAddress(wallet.name, coin);
                } else {
                    return Observable.throw('NO_WALLET_FOR_SELECTED_CRYPTO');
                }
            })
            .catch((error) => {
                console.log(error);
                return Observable.throw(error);
            });
    }

    // Creates a Pending Transaction to be signed by the user(s)

    public createPayment(address: string, amount: number, wallet: IHDWallet) {
        let data: {};
        // MultiSigned Wallets
        if (wallet.multiSignedKey !== '' && wallet.multiSignedKey !== undefined) {
            const mSWallet = this.getMultiSignedWallet(wallet.multiSignedKey);
            const addresses = [];
            mSWallet.signers.forEach((signer) => {
                addresses.unshift(signer.pubKey);
            });
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
            // return this.signPaymentMultiSigned(transaction, signingWallet);
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

/*  All of this is a
    WIP
    Which Means it is untested and unfinished
 */
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

    // WIP

    public createPendingTrx(transaction: ITransactionSke, wallet: Wallet) {
        console.log('We create the Pending TRX');
        console.log(transaction.tx.inputs);
        const msWallet = this.getMultiSignedWallet(wallet.multiSignedKey);
        const pendingTrx: IPendingTxs = {};
        pendingTrx.tx = transaction;
        pendingTrx.to = transaction.tx.outputs.pop().addresses.pop();
        pendingTrx.createdBy = this.user.email;
        pendingTrx.createdDate = new Date();
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
}
