import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAddressPage } from './edit-address';

@NgModule({
  declarations: [
    EditAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAddressPage),
  ],
})
export class EditAddressPageModule {}
