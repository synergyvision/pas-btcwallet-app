import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmPage } from './send-confirm';

@NgModule({
  declarations: [
    SendConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(SendConfirmPage),
  ],
})
export class SendConfirmPageModule {}
