import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheet } from 'ionic-angular';
import { User } from '../../app/models/user';
import { Wallet } from '../../app/models/wallet';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { AppSettings } from '../../app/app.settings';
import { Events } from 'ionic-angular/util/events';
import { SharedService } from '../../app/services/shared.service';
import { ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../app/services/alert.service';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public user: User;
  public wallets: Observable<any>;
  public options;
  public actionSheet: ActionSheet;

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events,
              private sharedService: SharedService, public actionSheetCtrl: ActionSheetController,
              public translate: TranslateService, public alertService: AlertService) {
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
    this.actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant('ACTION_SHEET.select'),
      buttons: [
          {
            text: this.translate.instant('ACTION_SHEET.take_photo'),
            handler: () => {
              this.changePictureHandler(false);
            },
          },
          {
            text: this.translate.instant('ACTION_SHEET.choose_photo'),
            handler: () => {
              this.changePictureHandler(true);
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
    this.actionSheet.present();
  }

  public backButtonAction() {
    // checks if Action Sheet is open
    console.log(this.actionSheet);
    if (this.actionSheet.isOverlay) {
        this.actionSheet.dismiss();
    } else {
        this.navCtrl.pop();
    }
  }

  public changePictureHandler(option: boolean) {
    this.alertService.showAlert('ALERT.changing_picture');
    this.sharedService.changePicture(option)
    .then((response) => {
      this.events.publish('user:changedData');
      this.alertService.showAlert('ALERT.picture_changed')
      .then()
      .catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
}
