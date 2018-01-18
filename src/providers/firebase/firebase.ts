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

@Injectable()
export class FirebaseProvider {

  public database = firebase.database();
  public wallets: Observable<any>;

  //Lists of refs
  constructor(private angularFire: AngularFireDatabase) {

  }

  // Placehoder function to test with BlockCypher
  public addAddressToWallet(address: IAddress, uid: string) {
    // Since a Wallet is just an array of addressess
    firebase.database().ref('user/' + uid + '/wallet/' + uid.substring(0, 25) + 'address/').set(address)
      .catch((err) => {
        console.log('ERROR ADDING ADDRESS TO FIREBASE:' + err);
      });
  }

  public addWallet(wallet: Wallet, uid: string) {
    firebase.database().ref('user/' + uid + '/wallet/').set(wallet)
      .catch((err) => {
        console.log('ERROR ADDING WALLET TO FIREBASE:' + err);
      });
  }

  // Returns all Wallets from a user
  public getWallets(uid: string): Observable<any> {
    return this.angularFire.object('user/' + uid + '/wallet/').valueChanges();
  }

  public getAddressBook(uid: string): Observable<any> {
    return this.angularFire.list('user/' + uid + '/addressBook/').valueChanges();
  }

  public addAddressToAddressBook(uid: string, address: Address) {
    this.angularFire.list('user/' + uid + '/addressBook/').push(address);
  }
}
