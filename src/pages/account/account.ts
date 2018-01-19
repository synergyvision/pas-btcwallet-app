import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { AuthService } from '../../app/services/auth.service';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Wallet } from '../../app/models/wallet';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public user: User;
  public wallets: Observable<any>;
  public pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,
              private dataService: FirebaseProvider) {
    this.user = this.authService.user;
    this.wallets = this.dataService.getWallets(this.user.uid);
    this.pages = [
      // { title: 'Usuario', component: HomePage },
      // { title: 'Contraseña', component: ListPage },
    ];
  }
}
