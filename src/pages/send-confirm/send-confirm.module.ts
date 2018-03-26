import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmPage } from './send-confirm';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(SendConfirmPage),
    TranslateModule.forChild(),
  ],
})
export class SendConfirmPageModule {}
