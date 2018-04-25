import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowMnemonicsPage } from './show-mnemonics';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ShowMnemonicsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowMnemonicsPage),
    TranslateModule.forChild(),
  ],
})
export class ShowMnemonicsPageModule {}
