import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { Wallet } from '../../app/models/wallet';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { AppSettings } from '../../app/app.settings';
import { Events } from 'ionic-angular/util/events';
import { SharedService } from '../../app/services/shared.service';
import { ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

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
              private sharedService: SharedService, public actionSheetCtrl: ActionSheetController,
              public translate: TranslateService) {
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

  public changePicture() {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant('ACTION_SHEET.select'),
      buttons: [
          {
            text: this.translate.instant('ACTION_SHEET.take_photo'),
            handler: () => {
              this.sharedService.changePicture(false);
            },
          },
          {
            text: this.translate.instant('ACTION_SHEET.choose_photo'),
            handler: () => {
              this.sharedService.changePicture(true);
            },
          },
          {
            text: this.translate.instant('FORM.cancel'),
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      });
    actionSheet.present();
    }
}
