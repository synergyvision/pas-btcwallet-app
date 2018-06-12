import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionConfirmationPage } from './transaction-confirmation';
import { TranslateModule } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    TransactionConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionConfirmationPage),
    TranslateModule.forChild(),
    NgPipesModule,
  ],
})
export class TransactionConfirmationPageModule {}
