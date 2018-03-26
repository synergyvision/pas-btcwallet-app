import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPage } from './send';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPage),
    TranslateModule.forChild(),
  ],
})
export class SendPageModule {}
