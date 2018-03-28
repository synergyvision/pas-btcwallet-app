import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { AlertService } from '../../app/services/alert.service';
import { LoaderService } from '../../app/services/loader.service';
import { Conditional } from '@angular/compiler';
import { AppData } from '../../app/app.data';
import { SharedService } from '../../app/services/shared.service';

@IonicPage()

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  private errorTitle: string;
  private error: string;
  private inputs;
  private registerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,
              private formBuilder: FormBuilder, private loaderService: LoaderService,
              private sharedService: SharedService) {

    this.inputs = AppData.registerForm;
    this.registerForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.registerForm.addControl(control.name, new FormControl(control.value));
      this.registerForm.controls[control.name].setValidators(control.validators);
    });

      // , (formGroup: FormGroup) => {
      //  return this.checkMatching(formGroup.controls.password, formGroup.controls.passwordRe);
      // },
  }

  private registerUser(registerForm: FormGroup) {
    this.loaderService.showLoader('Espere');
    this.authService.signup(registerForm).
      then((data) => {
        //WIP
        this.sharedService.createProfilePicture(registerForm.value.email);
        this.loaderService.dismissLoader();
        this.navCtrl.push('ConfirmEmailPage', registerForm.value.email);
      })
      .catch((error) => {
        this.loaderService.dismissLoader();
        this.errorTitle = error.title;
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
