import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../app/services/auth.service';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the ConfirmEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-email',
  templateUrl: 'confirm-email.html',
})
export class ConfirmEmailPage {

  private message = 'Se ha enviado un correo de verificación a';
  private email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.email = this.navParams.data;
    this.navCtrl.swipeBackEnabled = false;
    this.viewCtrl.showBackButton(false);
  }

  private resendEmail() {
    // Reenviamos el correo de verificacion
  }

  private goBack() {
    this.navCtrl.popToRoot();
  }

}
