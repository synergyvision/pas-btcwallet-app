import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppSettings } from '../../app/app.settings';
import { User } from '../../app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../app/services/shared.service';
import { AuthService } from '../../app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../app/services/loader.service';

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
  private validateToken: boolean;
  private token: number;
  private error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,
              public events: Events, private sharedService: SharedService, private formBuilder: FormBuilder,
              public translate: TranslateService, private loaderService: LoaderService) {
    this.securityOptions = AppSettings.securityOptions;
    this.update();
    this.showEmailInput = false;
    this.changeEmailForm = formBuilder.group({
      email: ['', [Validators.email, Validators.required, Validators.maxLength(30)]],
    });
    this.events.subscribe('user:changedData', () => {
      this.user = this.sharedService.user;
    });
  }

  get self() { return this; }

  private update() {
    this.sharedService.getToken();
    this.user = this.sharedService.user;
    this.validateToken = (this.user.token.activated === false) && (this.user.token.enabled === true);
    console.log(this.validateToken);
    console.log(this.user.token);
  }

  private sendVerificationEmail() {
    this.authService.sendVerificationEmail()
      .then(() => {
        this.message = this.translate.instant('SECURITY_OPTIONS.email_sent') + this.user.email;
      })
      .catch((error) => {
        this.message = this.translate.instant('ERROR.unknown');
      });
  }

  private restorePassword() {
    this.authService.restorePassword()
    .then(() => {
      this.message = this.translate.instant('SECURITY_OPTIONS.email_sent', {user: this.user.email});
    })
    .catch((error) => {
      this.message = this.translate.instant('ERROR.unknown');
    });
  }
  private ionViewDidLeave() {
    this.message = undefined;
    this.error = undefined;
  }

  private verifyToken() {
    this.error = undefined;
    this.loaderService.showLoader('LOADER.wait');
    this.authService.verify2FAU(this.token)
    .then((response) => {
      setTimeout(() => {
        this.update();
        this.message = this.translate.instant('SECURITY_OPTIONS.2FA_activated');
      }, 500);
      this.loaderService.dismissLoader();
    })
    .catch((error) => {
      this.loaderService.dismissLoader();
      this.error = this.translate.instant(error);
    });
  }

  private activateTwoFactorAuth() {
    this.authService.activate2FAU()
    .then((response) => {
      this.message = this.translate.instant('SECURITY_SETTINGS.activate_2FA', {email: this.user.email});
      this.update();
    })
    .catch((error) => {
      console.log(error);
      this.message = this.translate.instant(error);
    });
  }

  private deactivateTwoFactorAuth() {
    this.authService.deactivate2FAU()
    .then((response) => {
      this.message = this.translate.instant('SECURITY_SETTINGS.2FA_deactivated');
    })
    .catch((error) => {
      this.message = this.translate.instant(error);
    });
  }
}
