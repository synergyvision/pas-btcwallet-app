import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAddressPage } from './edit-address';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EditAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAddressPage),
    TranslateModule.forChild(),
  ],
})
export class EditAddressPageModule {}
