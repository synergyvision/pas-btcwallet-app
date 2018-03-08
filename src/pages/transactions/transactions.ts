import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { Transaction } from '../../app/models/transaction';
import { ITransaction, IWalletTrx } from '../../app/models/ITransaction';
import { Observable } from 'rxjs';
import { IAddress } from '../../app/models/IAddress';
import { LoaderService } from '../../app/services/loader.service';
import { Wallet } from '../../app/models/wallet';
import { SharedService } from '../../app/services/shared.service';

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
  private isEthereum: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService,
              private sharedService: SharedService, private loaderService: LoaderService) {
    this.segmentTxs = 'all';
    this.walletList = this.sharedService.wallets;
  }

  private onWalletChange() {
    this.getTransactions(this.selectedWallet);
  }

  private getTransactions(wallet) {
    this.restService.getWalletTransactions(wallet)
    .subscribe((data) => {
      if (wallet.address !== undefined) {
        this.txsList = this.receivedtransactions(data.txrefs, undefined, wallet.address);
      } else {
        this.txsList = this.receivedtransactions(data.txs, data.wallet.addresses, undefined);
      }
    }, (error) => {
        console.log(error);
      });
  }

  private receivedtransactions(txs: ITransaction[], addresses?: string[], address?: string) {
    if (addresses !== undefined) {
      this.isEthereum = false;
      txs.forEach((tx) => {
        const sent = tx.inputs.some((input) =>
          input.addresses.some((ad) =>
            addresses.includes(ad),
          ),
        );
        if (sent) {
          tx.filtering_value = 'sent';
        } else {
          tx.filtering_value = 'received';
        }
      });
    } else {
      this.isEthereum = true;
      txs.forEach((tx) => {
       if (tx.tx_input_n === 0) {
         tx.filtering_value = 'sent';
       } else {
         tx.filtering_value = 'received';
       }
      });
    }
    console.log(this.isEthereum);
    console.log(txs);
    return txs;
    }
}
