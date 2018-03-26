import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressPage } from './address';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddressPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressPage),
    TranslateModule.forChild(),
  ],
})
export class AddressPageModule {}
