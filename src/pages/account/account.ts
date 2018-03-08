import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { Wallet } from '../../app/models/wallet';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { AppSettings } from '../../app/app.settings';
import { Events } from 'ionic-angular/util/events';
import { SharedService } from '../../app/services/shared.service';

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
              private sharedService: SharedService) {
    this.user = this.sharedService.user;
    this.options = AppSettings.accountOptions;
    this.events.subscribe('user:changedData', () => {
      this.user = this.sharedService.user;
    });
    this.events.subscribe('user:loggedIn', () => {
      this.sharedService.updateUser();
      this.user = this.sharedService.user;
    });
  }

  public openOption(o) {
    if ((o.component !== this.navCtrl.getActive().component)) {
      this.navCtrl.push(o.component);
    }
  }
}
