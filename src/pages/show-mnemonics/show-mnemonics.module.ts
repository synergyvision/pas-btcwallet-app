import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowMnemonicsPage } from './show-mnemonics';

@NgModule({
  declarations: [
    ShowMnemonicsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowMnemonicsPage),
  ],
})
export class ShowMnemonicsPageModule {}
