import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionConfirmationPage } from './transaction-confirmation';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TransactionConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionConfirmationPage),
    TranslateModule.forChild(),
  ],
})
export class TransactionConfirmationPageModule {}
