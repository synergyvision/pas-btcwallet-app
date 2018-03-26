import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressBookPage } from './address-book';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddressBookPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressBookPage),
    TranslateModule.forChild(),
  ],
})
export class AddressBookPageModule {}
