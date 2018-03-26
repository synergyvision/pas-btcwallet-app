import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExchangePage } from './exchange';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ExchangePage,
  ],
  imports: [
    IonicPageModule.forChild(ExchangePage),
    TranslateModule.forChild(),
  ],
})
export class ExchangePageModule {}
