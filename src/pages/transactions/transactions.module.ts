import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionsPage } from './transactions';
import { NgPipesModule } from 'ngx-pipes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TransactionsPage,
  ],
  imports: [
    NgPipesModule,
    IonicPageModule.forChild(TransactionsPage),
    TranslateModule.forChild(),
  ],
})
export class TransactionsPageModule {}
