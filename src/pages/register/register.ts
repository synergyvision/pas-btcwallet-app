import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, AbstractControl } from '@angular/forms/src/model';
import { FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { AlertService } from '../../app/services/alert.service';
import { LoaderService } from '../../app/services/loader.service';
import { Conditional } from '@angular/compiler';
import { AppData } from '../../app/app.data';
import { SharedService } from '../../app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';

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
              private sharedService: SharedService, private translate: TranslateService) {

    this.inputs = AppData.registerForm;
    this.registerForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.registerForm.addControl(control.name,
      new FormControl(null, control.validators));
      if (control.name === 'confirmPassword') {
        this.registerForm.controls[control.name]
        .setValidators(this.checkMatching.bind(this));
      }
    });
  }

  private registerUser(registerForm: FormGroup) {
    this.loaderService.showLoader('LOADER.wait');
    this.authService.signup(registerForm).
      then((data) => {
        this.authService.sendVerificationEmail();
        this.loaderService.dismissLoader();
        this.navCtrl.push('ConfirmEmailPage', registerForm.value.email);
      })
      .catch((error) => {
        this.loaderService.dismissLoader();
        this.error = this.translate.instant('ERROR.' + error.code);
      });
  }

  private checkMatching(control: AbstractControl): ValidationErrors | null {
    return this.registerForm.get('password').value === control
    .value ? null : {mismatch: true};
  }

  private goToLogin() {
    this.navCtrl.pop();
  }
}
