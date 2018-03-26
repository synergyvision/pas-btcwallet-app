import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletPage } from './create-wallet';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CreateWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletPage),
    TranslateModule.forChild(),
  ],
})
export class CreateWalletPageModule {}
