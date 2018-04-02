import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppSettings } from '../../app/app.settings';
import { User } from '../../app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../app/services/shared.service';
import { AuthService } from '../../app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,
              public events: Events, private sharedService: SharedService, private formBuilder: FormBuilder,
              public translate: TranslateService) {
    this.securityOptions = AppSettings.securityOptions;
    this.user = this.sharedService.user;
    this.showEmailInput = false;
    this.changeEmailForm = formBuilder.group({
      email: ['', [Validators.email, Validators.required, Validators.maxLength(30)]],
    });
    this.events.subscribe('user:changedData', () => {
      this.user = this.sharedService.user;
    });
  }

  get self() { return this; }

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
      this.message = this.translate.instant('SECURITY_OPTIONS.email_sent') + this.user.email;
    })
    .catch((error) => {
      this.message = this.translate.instant('ERROR.unknown');
    });
  }
  private ionViewDidLeave() {
    this.message = undefined;
  }

  private activateTwoFactorAuth() {
    console.log('Here');
  }
}
