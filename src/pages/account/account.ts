import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { AuthService } from '../../app/services/auth.service';
import { Wallet } from '../../app/models/wallet';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { AppSettings } from '../../app/app.settings';
import { Events } from 'ionic-angular/util/events';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public user: User;
  public wallets: Observable<any>;
  public options;

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events, 
              private authService: AuthService) {
    this.user = this.authService.user;
    this.options = AppSettings.accountOptions;
    this.events.subscribe('user:changedData', () => {
      this.user = this.authService.user;
    });
    this.events.subscribe('user:loggedIn', () => {
      this.authService.updateUser();
      this.user = this.authService.user;
    });
  }

  public openOption(o) {
    if ((o.component !== this.navCtrl.getActive().component)) {
      this.navCtrl.push(o.component);
    }
  }
}
