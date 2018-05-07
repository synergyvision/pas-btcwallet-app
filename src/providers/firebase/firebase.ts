
import { Wallet } from '../../app/models/wallet';
import { Injectable, keyframes } from '@angular/core';
import { AngularFireList, AngularFireObject } from 'angularfire2/database/interfaces';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IToken, User } from '../../app/models/user';
import { AngularFireModule } from 'angularfire2';
import { Address } from '../../app/models/address';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { IKeys } from '../../app/models/IKeys';
import { IMSWalletRequest, IPendingTxs, ISigner, MultiSignedWallet } from '../../app/models/multisignedWallet';
import { CryptoCoin } from '../../app/models/crypto';
import { Activity } from '../../app/models/activity';
import { StorageProvider } from './storage';

/*
Class for managing CRUD Operations to the Database
Currently, uses Firebase Realtime Database, which is a NoSQL DB.
Complements the Firebase Auth Service, which handles user session.
Auth Stores some information about the user, the rest is managed here
More info can be found on https://firebase.google.com/docs/database/
*/

@Injectable()
export class FirebaseProvider {

  public wallets: Observable<any>;

  constructor(private angularFire: AngularFireDatabase, private storageProvider: StorageProvider) {

  }

  /*
  Basic CRUD Operations for user data
  Users are stored under the user / uid path on the database
  */

  // Adds a new user to the database

  public addUser(email: string, uid: string, pictureURL?: string) {
    // We save by default, the email, the currency of the user, and we create a Token Object for 2FA
    this.angularFire.list('user/' + uid).set('userEmail', email);
    this.angularFire.list('user/' + uid).set('currency', 'USD');
    this.angularFire.list('user/' + uid).set('token', {activated: false, enabled: false});
        // Depending on the provider used, the user might have a profile picture already
    if (pictureURL === undefined) {
      return this.createProfilePicture(email, uid)
      .then((url) => {
        return url;
      });
    } else {
      return this.angularFire.list('user/' + uid).set('img', pictureURL)
      .then(() => {
        return pictureURL;
      });
    }
  }

/*
  Creates a profile picture if the provider is email and password.
  More information about this provider
  https://firebase.google.com/docs/auth/web/password-auth
*/

  public createProfilePicture(email: string, uid: string) {
    return this.storageProvider.createProfileImage(email)
      .then((url) => {
        this.angularFire.list('user/' + uid).set('img', url);
        return url;
      });
  }

  public getProfilePicture(uid: string) {
    return this.angularFire.object('user/' + uid + 'img')
    .valueChanges()
    .map((url: string) => {
      return url;
    });
  }

  // Functions for retrieving data of the signed User

  // Gets the user IToken object
  public getToken(uid: string) {
    return this.angularFire.object('user/' + uid + '/token')
    .valueChanges()
    .map((token) => {
      return token as IToken;
    });
  }

  // Gets the user default currency
  public getCurrency(uid: string): Observable<string> {
    return this.angularFire.object('user/' + uid + '/currency')
    .valueChanges()
    .map((currency) => {
      return currency as string;
    });
  }

  // Functions for updating data of the signed User

  public updateCurrency(uid: string, currency: string) {
    return this.angularFire.list('user/' + uid).set('currency', currency);
  }

  public updateEmail(email: string, uid: string ) {
    this.angularFire.list('user/' + uid).set('userEmail', email);
  }

  /*
  Wallet CRUD Operations
  Wallets are stored under the user / uid / wallet path on the database
  */

  // Saves a new Wallet Object

  public addWallet(wallet: Wallet, uid: string) {
    this.angularFire.list('user/' + uid + '/wallet/').push(wallet);
  }

  // Retrieves all Wallets
  public getWallets(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/wallet/')
      .snapshotChanges()
      .map((changes) => {
        const wallet = changes.map((c) => ({
          key: c.payload.key, ...c.payload.val(),
        }));
        wallet.forEach((w) => {
          w.keys = {};
        });
        return wallet;
      });
  }

  // Updates the user preferences on the crypto data used by a Wallet

  public updateWalletCrypto(wallet: Wallet, uid: string) {
    return this.angularFire.list('user/' + uid + '/wallet/' + wallet.key)
    .update('crypto', wallet.crypto);
  }

  // Retrieves the Private Keys to be used on signing Operations

  public getWalletsKeys(uid: string, wallet: string): Observable<IKeys> {
    return this.angularFire.object('user/' + uid + '/wallet/' + wallet + '/keys/')
    .valueChanges()
    .map((key) => {
      return key as IKeys;
    });
  }

  /*
  Address Book CRUD Operations
  Address are stored under the user / uid / addressBook path on the database
  */

  // Retrieves all contacts registered on the Logged User Address Book

  public getAddressBook(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/addressBook/').
      snapshotChanges()
      .map((changes) => {
      return changes.map((c) => ({
        key: c.payload.key,
        ...c.payload.val(),
      }));
    });
  }

  // Adds another app user to the Address Book

  public addAddressToAddressBook(uid: string, address: Address) {
    this.angularFire.list('user/' + uid + '/addressBook/').push(address);
  }

  // Removes an address from the Address Book

  public removeAddressFromAddressBook(uid: string, address: string) {
    this.angularFire.list('user/' + uid + '/addressBook/').remove(address);
  }

  // Edits an address stored on the Address Book

  public editAddressFromAddressBook(uid: string, key: string, address: Address) {
    this.angularFire.list('user/' + uid + '/addressBook/').update(key, address);
  }

  // Verifies that an address is already on the AddressBook

  public getAddressFromAddressBook(uid: string, email: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/addressBook/' , (ref) =>
      ref.orderByChild('email')
      .equalTo(email))
      .snapshotChanges()
      .map((changes) => {
        return changes.map((c) => ({
          ...c.payload.val(),
        }));
      });
  }

  // Gets an especific Wallet from another user by using the email

  public getWalletByEmail(email: string, coin: string, multisigned?: string): Observable<any> {
    if (multisigned === '') {
      multisigned = null;
    }
    return this.angularFire.list('/user', (ref) =>
      ref.orderByChild('userEmail').equalTo(email))
      .valueChanges()
      .first()
      .map((user: any) => {
        const wallets = (user[0].wallet ? Object.values(user[0].wallet) : null) as Wallet[];
        const wallet = wallets.filter((w) => {
          return (w.crypto.value === coin);
        });
        if (wallet.length > 0) {
          const userWallet = wallet.filter((w) => {
            return w.multiSignedKey !== multisigned;
          }).pop();
          if ((userWallet.multiSignedKey !== '') || (userWallet.crypto.value === 'tet') ||
            (userWallet.crypto.value === 'eth')) {
            return {address: userWallet.address};
          }
          return {name: userWallet.name};
        }
    });
  }

  // Verifies if a user is registered on the APP

  public getUserByEmail(email: string) {
    return this.angularFire.list('user', (ref) =>
      ref.orderByChild('userEmail')
      .equalTo(email))
      .snapshotChanges()
      .map((users) => {
          return users.map((c) => ({
            key: c.payload.key,
            img: c.payload.val().img,
          }));
      });
  }

  // Activity CRUD Operations

  public addActivity(uid: string, activity: Activity) {
    this.angularFire.list('user/' + uid + '/activities/').push(activity).then((e) => {
      console.log(e);
    });
  }

  public getActivitiesList(uid: string) {
    return this.angularFire.list('user/' + uid + '/activities/').
      snapshotChanges()
      .map((changes) => {
      return changes.map((c) => ({
        key: c.payload.key, ...c.payload.val(),
      }));
    });
  }

  public removeActivity(uid: string, activity: string) {
    this.angularFire.list('user/' + uid + '/activities/').remove(activity);
  }

  // MultiSigned Wallets CRUD Operations

  public addMultiSignedWallet(multiWallet: MultiSignedWallet, walletOwner: any[]) {
    const key = this.angularFire.list('multiSignedWallet/').push(multiWallet).key;
    const wallet = multiWallet.toWallet(key);
    walletOwner.forEach((owner) => {
      wallet.keys = owner.pubKey;
      this.addWallet(wallet, owner.uid);
    });
  }

  public getMultiSignedWallet(walletKey: string): Observable<MultiSignedWallet> {
    return this.angularFire.object('multiSignedWallet/' + walletKey)
    .snapshotChanges()
    .map((changes) => {
    return {
        key: changes.payload.key,
        ... changes.payload.val(),
      };
    });
  }

  public updateMultiSignedWallet(wallet: MultiSignedWallet) {
    this.angularFire.object('multiSignedWallet/' + wallet.key).update(wallet);
  }

  // Gets the UID of a list of users just by their email

  public getSignerByEmail(emails: string[]): Observable<ISigner[]> {
    const result: Array<Observable<ISigner>> = [];
    emails.forEach((e) => {
      result.push(this.angularFire.list('user', (ref) =>
      ref.orderByChild('userEmail')
      .equalTo(e))
      .snapshotChanges()
      .map((changes) => {
        return changes.map((c) => ({
          uid: c.payload.key,
          email: e,
        })).pop();
      }));
    });
    return Observable.combineLatest(result);
  }

  // MulstiSigned Wallet Requests

  public addMultiSignedWalletRequest(request: IMSWalletRequest): IMSWalletRequest {
    this.angularFire.list('requests').push(request);
    return request;
  }

  public getMultiSignedWalletRequest(uid: string): Observable<IMSWalletRequest[]> {
    return this.angularFire.list('requests', (ref) =>
    ref.orderByChild('signers/' + uid)
    .equalTo(true))
    .snapshotChanges()
    .map((changes) => {
      return changes.map((c) => ({
        key: c.payload.key,
        ... c.payload.val(),
      }));
    });
  }

  public updateMultiSignedWalletRequest(request: IMSWalletRequest) {
    return this.angularFire.object('requests/' + request.key).update(request);
  }
  public deleteMultiSignedWalletRequest(request: IMSWalletRequest): Promise<any> {
    return this.angularFire.object('requests/' + request.key).remove();
  }

  // CRUD Operations for Pending Transactions
  public getPendingTrx(uid: string): Observable<IPendingTxs[]> {
    return this.angularFire.list('pendingTxs', (ref) =>
    ref.orderByChild('signers/' + uid)
    .equalTo(true))
    .snapshotChanges()
    .map((changes) => {
      return changes.map((c) =>
      ({
        key: c.payload.key,
        ... c.payload.val(),
      }));
    });
  }

  public getWalletPendingTrx(wallet: string): Observable<IPendingTxs[]> {
    return this.angularFire.list('pendingTxs', (ref) =>
    ref.orderByChild('wallet')
    .equalTo(wallet))
    .snapshotChanges()
    .map((changes) => {
      return changes.map((c) =>
      ({
        key: c.payload.key,
        ... c.payload.val(),
      }));
    });
  }

  public addPendingTrx(pendingTrx: IPendingTxs) {
    this.angularFire.list('pendingTxs/').push(pendingTrx);
  }

  public deletePendingTrx(pendingTrx: string) {
    return this.angularFire.object('pendingTxs/' + pendingTrx).remove();
  }

  public updatePendingTrx(pendingTrx: IPendingTxs) {
    return this.angularFire.object('pendingTxs/' + pendingTrx.key).update(pendingTrx);
  }

}
