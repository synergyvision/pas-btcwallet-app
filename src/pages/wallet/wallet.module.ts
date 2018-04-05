import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletPage } from './wallet';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletPage),
    TranslateModule.forChild(),
  ],
})
export class WalletPageModule {}
