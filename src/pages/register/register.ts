import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { AlertService } from '../../app/services/alert.service';
import { ConfirmEmailPage } from '../confirm-email/confirm-email';
import { LoaderService } from '../../app/services/loader.service';

@IonicPage()

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  private error: string;
  private registerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.registerForm = formBuilder.group({

      email: ['', Validators.compose([
        Validators.email,
        Validators.required,
        Validators.maxLength(30),
      ])],

      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
      ])],

      passwordRe: ['', Validators.compose([
        Validators.required,
      ])],
    },
      // , (formGroup: FormGroup) => {
      //  return this.checkMatching(formGroup.controls.password, formGroup.controls.passwordRe);
      // },
    );
  }

  private registerUser(registerForm: FormGroup) {
    this.loaderService.showLoader("Espere");
    this.authService.signup(registerForm).then((success) => {
      this.loaderService.dismissLoader();
      this.navCtrl.push(ConfirmEmailPage);
    }).catch((error) => {
      this.loaderService.dismissLoader();
      this.error = error.message;
    });
  }

  private checkMatching(pass, passRe) {
    return pass === passRe ? null : { notSame: true };
  }

  private goToLogin() {
    this.navCtrl.pop();
  }
}
