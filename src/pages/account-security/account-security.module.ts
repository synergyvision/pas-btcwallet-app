import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountSecurityPage } from './account-security';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AccountSecurityPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountSecurityPage),
    TranslateModule.forChild(),
  ],
})
export class AccountSecurityPageModule {}
