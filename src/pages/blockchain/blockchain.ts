import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppData } from '../../app/app.data';
import { RestService } from '../../app/services/rest.service';
import { IBlockchain, IBlock } from '../../app/models/IBlockchain';
import { ErrorService } from '../../app/services/error.service';

@IonicPage()
@Component({
  selector: 'page-blockchain',
  templateUrl: 'blockchain.html',
})
export class BlockchainPage {

  private crypto = AppData.cryptoCurrencies;
  private selectedCrypto;
  private blockchain: IBlockchain;
  private block: IBlock;
  private error: ErrorService;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService) {
  }

  private onBlockchainChange() {
    this.restService.getBlockChain(this.selectedCrypto)
    .subscribe((blockchain) => {
      this.blockchain = blockchain;
      console.log(blockchain);
    }, (error) => {
      this.error = error;
    });
  }

  private getBlock(hash: string) {
    this.restService.getBlock(hash, this.selectedCrypto)
    .subscribe((block) => {
      this.block = block;
    }, (error) => {
      this.error = error;
    });
  }


}
