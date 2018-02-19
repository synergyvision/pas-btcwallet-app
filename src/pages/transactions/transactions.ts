import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { Transaction } from '../../app/models/transaction';
import { AuthService } from '../../app/services/auth.service';
import { ITransaction } from '../../app/models/ITransaction';
import { Observable } from 'rxjs';
import { IAddress } from '../../app/models/IAddress';
import { LoaderService } from '../../app/services/loader.service';
import { Wallet } from '../../app/models/wallet';

@IonicPage()
@Component({
  providers: [RestService],
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {

  public search: string;
  public wallet: IAddress;
  public walletList: Wallet[];
  public selectedWallet;
  public txsList: ITransaction[];
  public segmentTxs: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService,
              private authService: AuthService, private loaderService: LoaderService) {
    this.loaderService.showFullLoader('Espere');
    this.segmentTxs = 'all';
    this.walletList = this.authService.wallets;
    this.walletList.forEach((wallet) => {
      this.restService.getWalletTransactions(this.authService.wallets[0])
      .subscribe((data) => {
        const addresses = data.wallet.addresses;
        this.txsList = this.receivedtransactions(addresses, data.txs);
        console.log(this.txsList);
        this.loaderService.dismissLoader();
      }, (error) => {
        console.log(error);
      });
    });
  }

  public receivedtransactions(addresses: string[], txs: ITransaction[]) {
    txs.forEach((tx) => {
      const sent = tx.inputs.some((input) =>
        input.addresses.some((address) =>
          addresses.includes(address),
        ),
      );
      if (sent) {
        tx.filtering_value = 'sent';
      } else {
        tx.filtering_value = 'received';
      }
    });
    return txs;
  }

}
