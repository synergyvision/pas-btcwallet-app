import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../app/services/auth.service';

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

  private message = 'Se ha enviado un correo de verificación a: ';
  private email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService) {
    this.email = authService.getLoggedUser().email;
  }

  private resendEmail(){
    
  }

}
