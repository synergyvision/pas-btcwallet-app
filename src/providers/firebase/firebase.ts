import { Injectable } from '@angular/core';
import { User } from '../../app/models/user';
import { AngularFireModule } from 'angularfire2';
import { AngularFireList, AngularFireObject } from 'angularfire2/database/interfaces';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IAddress } from '../../app/models/IAddress';
import { IWallet } from '../../app/models/IWallet';
import { Wallet } from '../../app/models/wallet';
import { Address } from '../../app/models/address';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Injectable()
export class FirebaseProvider {

  public wallets: Observable<any>;

  constructor(private angularFire: AngularFireDatabase) {

  }

  public addWallet(wallet: Wallet, uid: string) {
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

  public getAddressBook(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/addressBook/').
      snapshotChanges().map((changes) => {
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
}
