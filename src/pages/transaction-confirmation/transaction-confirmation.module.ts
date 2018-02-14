import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionConfirmationPage } from './transaction-confirmation';

@NgModule({
  declarations: [
    TransactionConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionConfirmationPage),
  ],
})
export class TransactionConfirmationPageModule {}
