import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../app/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../app/models/user';
import { AppSettings } from '../../app/app.settings';

@IonicPage()
@Component({
  selector: 'page-account-wallet',
  templateUrl: 'account-wallet.html',
})
export class AccountWalletPage {

  private wallets: Observable<any>;
  private user: User;
  private walletOptions = AppSettings.walletOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService) {
    this.wallets = this.authService.getWalletsAsync();
    this.user = this.authService.user;
  }

  get self() { return this; }

  public changeCurrency() {
    // TODO
  }
}
