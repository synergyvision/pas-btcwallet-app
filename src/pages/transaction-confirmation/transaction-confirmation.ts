import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ITransaction } from '../../app/interfaces/ITransaction';
import { RestService } from '../../app/services/rest.service';
import { TranslateService } from '@ngx-translate/core';
import { AppData } from '../../app/app.data';
import { Wallet } from '../../app/models/wallet';

@IonicPage()
@Component({
  selector: 'page-transaction-confirmation',
  templateUrl: 'transaction-confirmation.html',
})
export class TransactionConfirmationPage {

  private transaction: ITransaction;
  private wallet: Wallet;
  private metadata: string;
  private metadataList = AppData.metadataOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService,
              private translate: TranslateService) {
    this.transaction = navParams.get('transaction');
    this.wallet = navParams.get('wallet');
    if ((this.wallet.crypto.value !== 'eth') && (this.wallet.crypto.value !== 'tet')) {
      this.getMetadata();
    }
    this.transaction.inputs.length = this.transaction.outputs.length = 1;
  }

  

  private getMetadata() {
    this.restService.getMetadata(this.transaction.hash, this.wallet.crypto.value)
    .subscribe((metadata) => {
      if (metadata.hasOwnProperty('data')) {
        const name = this.metadataList.filter((value) => {
          return value.value === metadata['data'];
        }).pop().name;
        this.metadata = this.translate.instant(name);
      }
      }, (error) => {
        console.log(error);
    });
  }

  private goBack() {
    this.navCtrl.popToRoot();
  }

}

