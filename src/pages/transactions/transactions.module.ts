import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionsPage } from './transactions';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    TransactionsPage,
  ],
  imports: [
    NgPipesModule,
    IonicPageModule.forChild(TransactionsPage),
  ],
})
export class TransactionsPageModule {}
