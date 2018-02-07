import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountWalletPage } from './account-wallet';

@NgModule({
  declarations: [
    AccountWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountWalletPage),
  ],
})
export class AccountWalletPageModule {}
