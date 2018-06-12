import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionsPage } from './transactions';
import { TranslateModule } from '@ngx-translate/core';
import {NgPipesModule} from 'ngx-pipes';

@NgModule({
  declarations: [
    TransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionsPage),
    TranslateModule.forChild(),
    NgPipesModule,
  ],
})
export class TransactionsPageModule {}
