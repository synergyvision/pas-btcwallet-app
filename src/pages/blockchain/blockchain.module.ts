import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockchainPage } from './blockchain';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BlockchainPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockchainPage),
    TranslateModule.forChild(),
  ],
})
export class BlockchainPageModule {}
