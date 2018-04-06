import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppData } from '../../app/app.data';
import { RestService } from '../../app/services/rest.service';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { AlertService } from '../../app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { IBlockchain } from '../../app/interfaces/IBlockchain';
import { IBlock } from '../../app/interfaces/IBlock';

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
  private error: string;
  private showBlock: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService,
              public alertService: AlertService, private translate: TranslateService) {
  }

  private onBlockchainChange() {
    this.restService.getBlockChain(this.selectedCrypto)
    .subscribe((blockchain) => {
      this.blockchain = blockchain;
    }, (error) => {
      this.error = this.translate.instant(error);
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
    this.restService.getBlock(hash, this.selectedCrypto)
    .subscribe((block) => {
      this.showBlock = true;
      this.block = block;
    }, (error) => {
      this.handleError(error);
    });
  }

  // Needs to be changed when error service is correctly implemented
  private handleError(error) {
    console.log(error);
    this.alertService.showError(error)
    .then((res) => {
      this.navCtrl.pop();
    },
    (err) => {
      this.navCtrl.pop();
    });
  }
}
