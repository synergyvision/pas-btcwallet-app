import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountSecurityPage } from './account-security';

@NgModule({
  declarations: [
    AccountSecurityPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountSecurityPage),
  ],
})
export class AccountSecurityPageModule {}
