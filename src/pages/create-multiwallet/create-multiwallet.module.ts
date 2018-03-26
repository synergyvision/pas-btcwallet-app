import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMultiwalletPage } from './create-multiwallet';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateMultiwalletPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMultiwalletPage),
    TranslateModule.forChild(),
  ],
})
export class CreateMultiwalletPageModule {}
