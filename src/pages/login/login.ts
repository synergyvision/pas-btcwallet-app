import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { RegisterPage } from '../register/register';
import { AuthService } from '../../app/services/auth.service';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../app/services/alert.service';

// Component for the Login Page
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loginForm: FormGroup;
  private error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private authService: AuthService, private formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([
        Validators.email,
        Validators.required,
        Validators.maxLength(30),
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
      ])],
    });
  }

  private loginGoogle() {
    this.authService.loginGoogle().then((success) => {
      this.navCtrl.setRoot(HomePage);
    }).catch((error) => {
      this.error = 'Ha ocurrido un error, intente nuevamente';
    });
  }

  private loginEmail(loginForm: FormGroup) {
    this.authService.login(loginForm.value.email, loginForm.value.password)
      .then((success) => {
        this.navCtrl.setRoot(HomePage);
      }).catch((error) => {
        this.error = error.message;
      });
  }

  private goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
