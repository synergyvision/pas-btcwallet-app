import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmEmailPage } from './confirm-email';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ConfirmEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmEmailPage),
    TranslateModule.forChild(),
  ],
})
export class ConfirmEmailPageModule {}
