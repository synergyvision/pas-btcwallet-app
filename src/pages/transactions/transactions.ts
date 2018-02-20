import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { Transaction } from '../../app/models/transaction';
import { AuthService } from '../../app/services/auth.service';
import { ITransaction, IWalletTrx } from '../../app/models/ITransaction';
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
  public selectedWallet: Wallet;
  public txsList: ITransaction[];
  public segmentTxs: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService,
              private authService: AuthService, private loaderService: LoaderService) {
    this.segmentTxs = 'all';
    this.walletList = this.authService.wallets;
    console.log(this.walletList);
  }

  private onWalletChange() {
    console.log(this.selectedWallet);
    this.getTransactions(this.selectedWallet);
  }

  private getTransactions(wallet) {
    this.restService.getWalletTransactions(wallet)
    .subscribe((data) => {
      this.txsList = this.receivedtransactions(data.wallet.addresses, data.txs);
      }, (error) => {
        console.log(error);
      });
  }

  private receivedtransactions(addresses: string[], txs: ITransaction[]) {
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
