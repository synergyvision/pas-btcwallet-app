import { Injectable } from '@angular/core';
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

@Injectable()
export class FirebaseProvider {

  public wallets: Observable<any>;

  constructor(private angularFire: AngularFireDatabase) {

  }

  public addUser(email: string, uid: string) {
    this.angularFire.list('user/' + uid).set('userEmail', email);
    this.angularFire.list('user/' + uid).set('currency', 'USD');
  }

  public updateCurreny(uid: string, currency: string) {
    this.angularFire.list('user/' + uid).set('currency', currency);
  }

  public getCurrency(uid: string){
    return this.angularFire.object('user/' + uid + '/currency')
    .valueChanges()
    .map((currency) => {
      return currency;
    });
  }

  public updateEmail(email: string, uid: string ) {
    this.angularFire.list('user/' + uid).set('userEmail', email);
  }

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

  public updateWalletCrypto(wallet: Wallet, uid: string) {
    return this.angularFire.list('user/' + uid + '/wallet/' + wallet.key)
    .update('crypto', wallet.crypto);
}

  public getWalletsKeys(uid: string, wallet: string): Observable<IKeys> {
    return this.angularFire.object('user/' + uid + '/wallet/' + wallet + '/keys/')
    .valueChanges()
    .map((key) => {
      return key as IKeys;
    });
  }

  public getAddressBook(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/addressBook/').
      snapshotChanges()
      .map((changes) => {
      return changes.map((c) => ({
        key: c.payload.key, ...c.payload.val(),
      }));
    });
  }

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

  public getUserByEmail(email: string) {
    return this.angularFire.list('/user', (ref) =>
      ref.orderByChild('userEmail')
      .equalTo(email))
      .valueChanges();
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

  public addActivity(uid: string, activity) {
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
}
