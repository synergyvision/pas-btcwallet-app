import { KeyService } from './key.service';
import { Injectable } from '@angular/core';
import { Wallet } from '../models/wallet';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { ErrorService } from './error.service';
import { EventService } from './events.services';
import { FormGroup } from '@angular/forms';
import { ITransactionSke } from '../models/ITransaction';
import { IHDWallet } from '../models/IHDWallet';
import { IBalance } from '../models/IBalance';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Events } from 'ionic-angular';
import { IKeys } from '../models/IKeys';
import { ExchangeService } from './exchange.service';
import { IExchange } from '../models/IExchange';
import { IMSWalletRequest, IPendingTxs, ISigner, MultiSignedWallet } from '../models/multisignedWallet';
import { IAddress } from '../models/IAddress';
import { Address } from '../models/address';
import { AppData } from '../app.data';
import { Activity } from '../models/activity';

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
    public pendingTxs: IPendingTxs[] = [];

    constructor(public firebaseData: FirebaseProvider, public restService: RestService, public events: Events,
                public eventService: EventService, public keyService: KeyService, public authService: AuthService,
                public exchangeService: ExchangeService) {
        this.events.subscribe('user:loggedOut', () => {
            this.user = this.wallets = this.balances = this.multiSignedWallets = undefined;
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
        }
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
        this.getPendingTx();
    }

    public getPendingTx(): Observable<IPendingTxs[]> {
        return this.firebaseData.getPendingTrx(this.user.uid)
        .map((pending) => {
            return pending.filter((tx) => {
                if (tx.dismissed !== undefined) {
                    return (!tx.dismissed.includes(this.user.email) &&
                           (!tx.approved.includes(this.user.email)));
                } else if (!tx.approved.includes(this.user.email)) {
                    return tx;
                }

            });
        });
    }

    public updateUser() {
        this.user = this.authService.getLoggedUser();
        this.setUser(this.user);
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

    public getCurrency() {
        this.firebaseData.getCurrency(this.user.uid)
            .subscribe((currency) => {
                this.currency = currency;
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
                return Observable.throw(error);
            });
    }

    // Creates a Pending Transaction to be signed by the user(s)

    public createPayment(address: string, amount: number, wallet: IHDWallet) {
        let data: {};
        // MultiSigned Wallets
        if (wallet.multiSignedKey !== '') {
            const mSWallet = this.getMultiSignedWallet(wallet.multiSignedKey);
            const addresses = [];
            mSWallet.signers.forEach((signer) => {
                addresses.unshift(signer.pubKey);
            });
            data = JSON.stringify({
                inputs: [{
                    addresses: addresses,
                    script_type: 'multisig-2-of-2',
                }],
                outputs: [{
                    addresses: [
                        address,
                    ],
                    value: Number(amount),
                }],
            });
        }
        // Ethereum and Ethereum Testnet Wallets
        if ((wallet.address !== '') && ((wallet.crypto.value === 'tet') || (wallet.crypto.value === 'bet'))) {
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
        } else if (wallet.address === '') {
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

    // We Verify that all signers are registered on the App

    public addressesExist(emails: string[]): Observable<any> {
        console.log(emails);
        const response: Array<Observable<any>> = [];
        emails.forEach((email) => {
            response.push(this.addressExist(email));
        });
        return Observable.combineLatest(response)
            .map((result) => {
                if (result.includes(false)) {
                    return false;
                } else {
                    return true;
                }
            }, (error) => {
                return Observable.throw(error);
        });
    }

    // We create the MultiSigned Walled Request for the other users on the App

    public createMultisignWalletRequest(data: any, users: string[]): Observable<any> {
        const request: IMSWalletRequest = {};
        request.createdBy = this.user.email;
        request.crypto = data.selectedCrypto;
        users.push(this.user.email);
        request.signers = users;
        request.accepted = [];
        request.accepted.push(this.user.email);
        request.type = 'multisig-' +  data.numberOfSigners + '-of-' + data.numberOfSignatures;
        console.log(request);
        return this.addMultiSignedWalletRequest(request);
    }

    public createISignerData(signers: {}) {
        return Object.keys(signers).map((key) => {
            return { uid: key, pubKey: '' };
        });
    }

    public rejectMultiSignedWalletRequest(request: IMSWalletRequest) {
        return new Promise((resolve, reject) => {
            this.firebaseData.deleteMultiSignedWalletRequest(request).
            then((deleted) => {
                const rejectedWallet = new Activity(Date.toString(),
                'El usuario' + this.user.email + 'rechazo su solicitud de billetera multifirmada');
                this.firebaseData.getUserByEmail(request.createdBy)
                .subscribe((user) => {
                    this.firebaseData.addActivity(user.pop().key, rejectedWallet);
                });
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    public addMultiSignedWalletRequest(request: IMSWalletRequest): Observable<any> {
        return this.firebaseData.getSignerByEmail(request.signers)
        .first()
        .map((keys) => {
            request.signers = Object.assign({}, ...keys.map((key) => {
                return {[key.uid] : true};
            }));
            console.log(keys);
            console.log(request.signers);
            return Observable.of(this.firebaseData.addMultiSignedWalletRequest(request));
        }, (error) => {
            return Observable.throw(error);
        });
    }

    public acceptMultiSignedWalletRequest(request: IMSWalletRequest) {
        request.accepted.push(this.user.email);
        if (Object.keys(request.signers).length === request.accepted.length) {
            this.firebaseData.deleteMultiSignedWalletRequest(request)
            .then(() => {
                request.signers = this.createISignerData(request.signers);
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
            const name = 'MS' + request.crypto + this.user.uid.substring(0, 19);
            const script = request.type;
            const currency = AppData.cryptoUnitList.filter((c) => {
                return c.value.includes(request.crypto);
            }).pop();
            currency.units = currency.units.pop();
            // We create the Keys for every Signer
            const keys = this.keyService.createMultiSignedKeys(request.signers.length, request.crypto);
            const pubKeys: string[] = [];
            request.signers.forEach((user) => {
                user.pubKey = keys.shift();
                pubKeys.unshift(user.pubKey.xpub);
            });
            const signers = JSON.parse(JSON.stringify(request.signers)) as ISigner[];
            // if ((request.crypto !== 'tet') && (request.crypto !== 'eth')) {
            this.restService.createMultiSignedAddress(request.crypto, pubKeys, script)
                .first()
                .subscribe((address: IAddress) => {
                    const newWallet = new MultiSignedWallet(name, currency, signers, script, address.address);
                    const key = this.firebaseData.addMultiSignedWallet(newWallet, request.signers);
                    resolve(newWallet);
                },
                    (error) => {
                        reject(error);
                    });
/*             } else {
                /* // Ethereum wallets
                 // const address = this.keyService.generateAddress(keys);
                const newWallet = new Wallet(name, keys, currency);
                newWallet.address = address;
                this.firebaseData.addWallet(newWallet, this.user.uid);
                resolve(newWallet); */
            // }
        });
    }

    // WIP

    public createPendingTrx(transaction: ITransactionSke, wallet: Wallet) {
        console.log('We create the Pending TRX');
        const msWallet = this.getMultiSignedWallet(wallet.multiSignedKey);
        const pendingTrx: IPendingTxs = {};
        pendingTrx.tx = transaction;
        pendingTrx.to = transaction.tx.outputs.pop().addresses.pop();
        pendingTrx.createdBy = this.user.email;
        pendingTrx.wallet = wallet.multiSignedKey;
        pendingTrx.amount = transaction.tx.total;
        pendingTrx.approved = [];
        pendingTrx.dismissed = [];
        pendingTrx.signers = Object.assign({}, ...msWallet.signers.map((key) => {
            return {[key.uid] : true};
        }));
        console.log('DONE!');
        console.log(pendingTrx);
        console.log('Hash');
        console.log(pendingTrx.tx.tx.hash);
        return this.acceptPendingTrx(pendingTrx, wallet, msWallet);
    }

    // Accepts and sends the Transaction Signed by the User
    public acceptPendingTrx(pendingTrx: IPendingTxs, wallet?: Wallet, msWallet?: MultiSignedWallet): Observable<any> {
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
            console.log(pendingTrx.tx.tx.inputs);
            return this.restService.sendPayment(trx, wallet.crypto.value)
            .flatMap((data) => {
                console.log('Signed');
                console.log(data);
                console.log('Hash');
                console.log(data.tx.hash);
                console.log(pendingTrx.tx.tx.hash);
                if (pendingTrx.approved.length === (Number(msWallet.type.replace('multisig-', '').slice(0, 1)))) {
                    // Transaction was approved by the minimun number of signers
                    console.log('here');
                    this.cancelPendingTrx(pendingTrx.key);
                } else {
                    // pendingTrx.tx.tx.hash = data.tx.hash;
                    this.firebaseData.addPendingTrx(pendingTrx);
                }
                return Observable.of(pendingTrx.tx);
            });
        })
        .catch((error) => {
            console.log(error);
            throw Observable.throw(error);
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

    public signPaymentMultiSigned(transaction: ITransactionSke, wallet: IHDWallet) {
        const mSWallet = this.getMultiSignedWallet(wallet.multiSignedKey);
        const pubKeys = [];
        const uids = [];
        mSWallet.signers.forEach((signer) => {
            pubKeys.push(signer.pubKey);
            uids.push(signer.uid);
        });
        // this.firebaseData.getSignersKey(uids, wallet.multiSignedKey);
        // const trx = this.keyService.signMultiWithPrivKey(transaction, pubKeys, wallet.crypto.value);
        // console.log(trx);
        // return this.restService.sendPayment(trx, wallet.crypto.value);
    }


}
