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
import { Keys } from '../../app/models/Keys';

@Injectable()
export class FirebaseProvider {

  public wallets: Observable<any>;

  constructor(private angularFire: AngularFireDatabase) {

  }

  public addUser(user: string, uid: string, keys?: Keys) {
    this.angularFire.list('user/' + uid).set('userEmail', user);
  }

  public addWallet(wallet: any, uid: string) {
    this.angularFire.list('user/' + uid + '/wallet/').push(wallet);
  }

  public getWallets(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/wallet/')
      .snapshotChanges().map((changes) => {
        return changes.map((c) => ({
          key: c.payload.key, ...c.payload.val(),
        }));
      });
  }

  public addAddressToWallet(wallet: Wallet, uid: string, address: string) {
    this.angularFire.list('user/' + uid + '/wallet/' + wallet.key + '/addresses').push(address);
  }

  public getAddressBook(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/addressBook/').
      snapshotChanges().map((changes) => {
      return changes.map((c) => ({
        key: c.payload.key, ...c.payload.val(),
      }));
    });
  }

  public getWalletByEmail(email: string): Observable<any> {
    return this.angularFire.list('/user', (ref) =>
      ref.orderByChild('userEmail').equalTo(email))
      .snapshotChanges()
      .map((changes) => {
        return changes.map((c) => ({
          key: c.payload.key, ...c.payload.val(),
        }));
      });
  }

  public updateWallet(wallet: Wallet, uid: string, key: string) {
      this.angularFire.list('user/' + uid + '/wallet/').update(key, wallet);
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
}
