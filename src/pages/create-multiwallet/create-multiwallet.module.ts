import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMultiwalletPage } from './create-multiwallet';

@NgModule({
  declarations: [
    CreateMultiwalletPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMultiwalletPage),
  ],
})
export class CreateMultiwalletPageModule {}
