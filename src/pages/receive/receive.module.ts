import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivePage } from './receive';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    ReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivePage),
    QRCodeModule,
  ],
})
export class ReceivePageModule {}
