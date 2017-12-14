import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressBookPage } from './address-book';

@NgModule({
  declarations: [
    AddressBookPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressBookPage),
  ],
})
export class AddressBookPageModule {}
