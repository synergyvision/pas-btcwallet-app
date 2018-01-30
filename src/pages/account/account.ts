import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { AuthService } from '../../app/services/auth.service';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Wallet } from '../../app/models/wallet';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { RestService } from '../../app/services/rest.service';
import { AppSettings } from '../../app/app.settings';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public user: User;
  public wallets: Observable<any>;
  public options;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,
              private dataProvider: FirebaseProvider, private restService: RestService) {
    this.user = this.authService.user;
    this.wallets = this.authService.getWallets();
    const test = this.wallets;
    test.subscribe((data) => {
      this.restService.addFundsTestnet(data[0].addresses[0], 56000)
      .subscribe((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
    });
    this.options = AppSettings.accountOptions;
  }
}
