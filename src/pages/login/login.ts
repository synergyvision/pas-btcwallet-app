import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../app/services/auth.service';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../app/services/alert.service';
import { EventService } from '../../app/services/events.services';
import { AppData } from '../../app/app.data';

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
              private authService: AuthService, private formBuilder: FormBuilder, private eventService: EventService) {
    this.inputs = AppData.loginForm;
    this.loginForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.loginForm.addControl(control.name, new FormControl(control.value));
      this.loginForm.controls[control.name].setValidators(control.validators);
    });
  }

  private loginGoogle() {
    this.authService.loginGoogle().then((success) => {
      this.events.publish('user:loggedIn');
    }).catch((error) => {
      this.error = 'Ha ocurrido un error, intente nuevamente';
    });
  }

  private loginEmail(loginForm: FormGroup) {
    this.authService.login(loginForm.value.email, loginForm.value.password)
      .then((success) => {
        this.events.publish('user:loggedIn');
      }).catch((error) => {
        this.error = error.message;
      });
  }

  private goToRegister() {
    this.navCtrl.push('RegisterPage');
  }

}
