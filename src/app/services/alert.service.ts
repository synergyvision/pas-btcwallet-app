import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { App, NavController } from 'ionic-angular/index';
import { Alert } from 'ionic-angular/components/alert/alert';
import { TranslateService } from '@ngx-translate/core';

/*
Service for handling the Application Alert Notifications
This allows to show errors or messages to the user taking advantage of mobile interface elements
 */

@Injectable()
export class AlertService {

  private nav: NavController;
  private buttonList;

  constructor(private alertCtrl: AlertController, private app: App, private translate: TranslateService) { }

  // Standard Function for showing Errors
  public showError(errorCode) {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        title: this.translate.instant('ALERT.error'),
        message: this.translate.instant(errorCode),
        buttons: [
          {
            text: this.translate.instant('FORM.go_back'),
            role: 'dismiss',
            handler: () => {
              reject(false);
            },
          },
        ],
      });
      alert.present();
    });
  }

  // Standard function for showing Messages
  public showAlert(msg?, title?) {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        title: this.translate.instant(title) || '',
        message: this.translate.instant(msg) || '',
        buttons: [
          {
            text: this.translate.instant('FORM.continue'),
            handler: () => {
              resolve(true);
            },
          },
        ],
      });
      alert.present();
    });
  }

  // Standard function for showing Full Screen Messages
  public showFullAlert(msg) {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        message: this.translate.instant(msg) || '',
        cssClass: 'fullAlert',
        buttons: [
          {
            text: this.translate.instant('FORM.continue'),
            handler: () => {
              resolve(true);
            },
          },
        ],
      });
      alert.present();
    });
  }

  // Standard function for showing Full Screen Errors
  public showFullError(msg?, title?, subtitle?) {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        title: this.translate.instant(title) || this.translate.instant('ALERT.error'),
        message: this.translate.instant(msg) || this.translate.instant('ALERT.try_later'),
        subTitle: this.translate.instant(subtitle) || '',
        cssClass: 'fullAlert',
        buttons: [
          {
            text: this.translate.instant('FORM.go_back'),
            role: 'dismiss',
            handler: () => {
              reject(false);
            },
          },
        ],
      });
      alert.present();
    });
  }

}
