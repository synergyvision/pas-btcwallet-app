import { Injectable, keyframes } from '@angular/core';
import { User } from '../../app/models/user';
import { AngularFireModule } from 'angularfire2';
import { AngularFireList, AngularFireObject } from 'angularfire2/database/interfaces';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IAddress } from '../../app/models/IAddress';
import { IHDWallet } from '../../app/models/IHDWallet';
import { Wallet } from '../../app/models/wallet';
import { Address } from '../../app/models/address';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { IKeys } from '../../app/models/IKeys';
import { MultiSignedWallet, ISigner, IMSWalletRequest, IPendingTxs } from '../../app/models/multisignedWallet';
import { CryptoCoin } from '../../app/models/crypto';
import { Activity } from '../../app/models/activity';

@Injectable()
export class FirebaseProvider {

  public wallets: Observable<any>;

  constructor(private angularFire: AngularFireDatabase) {

  }

  // Add User to the DB

  public addUser(email: string, uid: string) {
    this.angularFire.list('user/' + uid).set('userEmail', email);
    this.angularFire.list('user/' + uid).set('currency', 'USD');
  }
  // Retrieve Data of Signed User

  public getCurrency(uid: string) {
    return this.angularFire.object('user/' + uid + '/currency')
    .valueChanges()
    .map((currency) => {
      return currency;
    });
  }

  // Update Data of Signed User

  public updateCurreny(uid: string, currency: string) {
    this.angularFire.list('user/' + uid).set('currency', currency);
  }

  public updateEmail(email: string, uid: string ) {
    this.angularFire.list('user/' + uid).set('userEmail', email);
  }

  // Wallet CRUD Operations

  public addWallet(wallet: Wallet, uid: string) {
    this.angularFire.list('user/' + uid + '/wallet/').push(wallet);
  }

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

  public setWallet(wallet: Wallet, uid: string, key: string) {
    this.angularFire.list('user/' + uid + '/wallet/').push(wallet);
  }

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

  // Address Book CRUD Operations

  // Retrieves all contacts registered on the Logged User Address Book

  public getAddressBook(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/addressBook/').
      snapshotChanges()
      .map((changes) => {
      return changes.map((c) => ({
        key: c.payload.key, ...c.payload.val(),
      }));
    });
  }

  public addAddressToAddressBook(uid: string, address: Address) {
    this.angularFire.list('user/' + uid + '/addressBook/').push(address);
  }

  public removeAddressFromAddressBook(uid: string, address: string) {
    this.angularFire.list('user/' + uid + '/addressBook/').remove(address);
  }

  public editAddressFromAddressBook(uid: string, key: string, address: Address) {
    this.angularFire.list('user/' + uid + '/addressBook/').update(key, address);
  }

  // Verifies that the contact is already on the AddressBook

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

  public getWalletByEmail(email: string, coin: string): Observable<any> {
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
          const userWallet = wallet.pop();
          if ((userWallet.crypto.value === 'tet') || (userWallet.crypto.value === 'eth')) {
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
          }));
      });
  }

  public addActivity(uid: string, activity: Activity) {
    this.angularFire.list('user/' + uid + '/activities/').push(activity);
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

  // MultiSigned Wallets

  public addMultiSignedWallet(multiWallet: MultiSignedWallet, walletOwner: any[]) {
    const key = this.angularFire.list('multiSignedWallet/').push(multiWallet).key;
    const wallet = multiWallet.toWallet(key);
    walletOwner.forEach((owner) => {
      wallet.keys = owner.pubKey;
      this.setWallet(wallet, owner.uid, key);
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

  public addPendingTrx(pendingTrx: IPendingTxs) {
    return this.angularFire.list('pendingTxs/').push(pendingTrx);
  }

  public deletePendingTrx(pendingTrx: string) {
    return this.angularFire.object('pendingTxs/' + pendingTrx).remove();
  }

  public updatePendingTrx(pendingTrx: IPendingTxs) {
    return this.angularFire.object('pendingTxs/' + pendingTrx.key).update(pendingTrx);
  }

}
