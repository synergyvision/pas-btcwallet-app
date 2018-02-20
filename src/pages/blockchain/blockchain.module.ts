import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockchainPage } from './blockchain';

@NgModule({
  declarations: [
    BlockchainPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockchainPage),
  ],
})
export class BlockchainPageModule {}
