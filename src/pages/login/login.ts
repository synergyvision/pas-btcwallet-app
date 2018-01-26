import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { RegisterPage } from '../register/register';
import { AuthService } from '../../app/services/auth.service';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../app/services/alert.service';
import { AppSettings } from '../../app/app.settings';

// Component for the Login Page
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loginForm: FormGroup;
  private error: string;
  private inputs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events,
              private authService: AuthService, private formBuilder: FormBuilder) {
    this.inputs = AppSettings.loginForm;
    this.loginForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.loginForm.addControl(control.name, new FormControl(control.value));
      this.loginForm.controls[control.name].setValidators(control.validators);
    });
  }

  private loginGoogle() {
    this.authService.loginGoogle().then((success) => {
      this.navCtrl.setRoot(HomePage);
      this.events.publish('user:loggedIn', this.authService.user);
    }).catch((error) => {
      this.error = 'Ha ocurrido un error, intente nuevamente';
    });
  }

  private loginEmail(loginForm: FormGroup) {
    this.authService.login(loginForm.value.email, loginForm.value.password)
      .then((success) => {
        this.navCtrl.setRoot(HomePage);
        this.events.publish('user:loggedIn', this.authService.user);
      }).catch((error) => {
        this.error = error.message;
      });
  }

  private goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
