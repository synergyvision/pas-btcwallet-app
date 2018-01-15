import { Injectable } from '@angular/core';
import { User } from '../../app/models/user';
import { AngularFireModule } from 'angularfire2';
import { AngularFireList, AngularFireObject } from 'angularfire2/database/interfaces';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseProvider {

  public database = firebase.database(); 

  constructor(private angularFire: AngularFireDatabase) {

  }
  public getUsers(): AngularFireList<{}> {
    return this.angularFire.list('/users/');
  }

  public updateUser(displayName, provider) {
    //
  }
}
