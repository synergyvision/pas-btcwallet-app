import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountWalletPage } from './account-wallet';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AccountWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountWalletPage),
    TranslateModule.forChild(),
  ],
})
export class AccountWalletPageModule {}
