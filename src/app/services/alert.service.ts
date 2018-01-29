import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { App, NavController } from 'ionic-angular/index';
import { Alert } from 'ionic-angular/components/alert/alert';

@Injectable()
export class AlertService {

  private nav: NavController;
  private buttonList;

  constructor(private alertCtrl: AlertController, private app: App) { }

  public showAlert(msg?, title?, subtitle?) {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        title: title || 'Error',
        message: msg || 'Se ha detectado un error, intente más tarde',
        subTitle: subtitle || '',
        buttons: [
          {
            text: 'Volver',
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

  public showFullAlert(msg?, title?, subtitle?) {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        title: title || 'Error',
        message: msg || 'Se ha detectado un error, intente más tarde',
        subTitle: subtitle || '',
        cssClass: 'fullAlert',
        buttons: [
          {
            text: 'Volver',
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
