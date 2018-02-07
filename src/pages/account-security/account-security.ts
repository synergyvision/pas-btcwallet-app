import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AppSettings } from '../../app/app.settings';
import { AuthService } from '../../app/services/auth.service';
import { User } from '../../app/models/user';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-account-security',
  templateUrl: 'account-security.html',
})
export class AccountSecurityPage {

  private securityOptions;
  private message: string;
  private user: User;
  private showEmailInput: boolean;
  private changeEmailForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
              private authService: AuthService, private formBuilder: FormBuilder) {
    this.securityOptions = AppSettings.securityOptions;
    this.user = this.authService.user;
    this.showEmailInput = false;
    this.changeEmailForm = formBuilder.group({
      email: ['', [Validators.email, Validators.required, Validators.maxLength(30)]],
    });
    this.events.subscribe('user:changedData', () => {
      this.user = this.authService.user;
    });
  }

  get self() { return this; }

  private sendVerificationEmail() {
    this.authService.sendVerificationEmail()
      .then(() => {
        this.message = 'Correo Enviado a ' + this.user.email;
      })
      .catch((error) => {
        this.message = 'Ha ocurrido un error, intente mas tarde';
      });
  }

  private restorePassword() {
    this.authService.restorePassword()
    .then(() => {
      this.authService.restorePassword();
      this.message = 'Se envió un correo a ' + this.user.email;
    })
    .catch((error) => {
      this.message = 'Ha ocurrido un error, intente mas tarde';
    });
  }
  private ionViewDidLeave() {
    this.message = undefined;
  }
}
