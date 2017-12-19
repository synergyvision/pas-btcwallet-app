import { Component, ViewChild } from '@angular/core';
import { IonicPage,  NavController, NavParams} from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { RegisterPage } from '../register/register';

// Component for the Login Page
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  private goToLogIn() {
    this.navCtrl.setRoot(HomePage);
  }

  private goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
