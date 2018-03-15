import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppData } from '../../app/app.data';
import { RestService } from '../../app/services/rest.service';
import { IBlock, IBlockchain } from '../../app/models/IBlockchain';
import { ErrorService } from '../../app/services/error.service';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { AlertService } from '../../app/services/alert.service';

@IonicPage()
@Component({
  selector: 'page-blockchain',
  templateUrl: 'blockchain.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('500ms', style({ transform: 'translateX(0)', opacity: 1 })),
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 })),
        ]),
      ]),
  ],
})
export class BlockchainPage {

  private crypto = AppData.cryptoCurrencies;
  private selectedCrypto;
  private blockchain: IBlockchain;
  private block: IBlock;
  private error: ErrorService;
  private showBlock: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService,
              public alertService: AlertService) {
  }

  private onBlockchainChange() {
    this.restService.getBlockChain(this.selectedCrypto)
    .subscribe((blockchain) => {
      this.blockchain = blockchain;
    }, (error) => {
      this.error = error;
    });
  }

  private toggleBlock(hash: string) {
    if (this.block !== undefined) {
      this.showBlock = !this.showBlock;
    } else {
     this.getBlock(hash);
    }
  }

  private getBlock(hash: string, only?: boolean) {
    if (only) {
      this.blockchain = undefined;
    }
    this.restService.getBlock(hash, this.selectedCrypto).subscribe((block) => {
      this.showBlock = true;
      this.block = block;
    }, (error) => {
      this.handleError(error);
    });
  }

  private handleError(error) {
    this.alertService.showAlert().then((res) => {
      this.navCtrl.pop();
    },
    (err) => {
      this.navCtrl.pop();
    });
  }


}
