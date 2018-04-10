import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { Transaction } from '../../app/models/transaction';
import { Observable } from 'rxjs';
import { LoaderService } from '../../app/services/loader.service';
import { Wallet } from '../../app/models/wallet';
import { SharedService } from '../../app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { IAddress } from '../../app/interfaces/IAddress';
import { ITransaction } from '../../app/interfaces/ITransaction';

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
  private error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService,
              private sharedService: SharedService, private loaderService: LoaderService,
              private translate: TranslateService) {
    this.segmentTxs = 'all';
    this.walletList = this.sharedService.wallets;
  }

  private onWalletChange() {
    this.getTransactions(this.selectedWallet);
    this.error = undefined;
  }

  private getTransactions(wallet: Wallet) {
    this.restService.getWalletTransactions(wallet)
      .subscribe((data) => {
        console.log(data);
        if (wallet.address !== '') {
          this.txsList = this.receivedtransactions(data.txs, [], wallet.address, wallet.crypto.value);
        } else {
          this.txsList = this.receivedtransactions(data.txs, data.wallet.addresses, undefined, undefined);
        }
      }, (error) => {
        // We need to show an error
        this.error = this.translate.instant(error);
      });
  }

  private receivedtransactions(txs: ITransaction[], addresses?: string[], address?: string, crypto?: string) {
    if (txs === undefined || txs.length < 1) {
      this.error = this.translate.instant('TRANSACTIONS.no_transactions');
    } else if ((crypto === 'tet' || crypto === 'bet')) {
      this.isEthereum = true;
      return this.filterEthereum(txs, address);
    } else {
      this.isEthereum = false;
      if (address !== undefined) {
        addresses.push(address);
      }
      return this.filterWallet(txs, addresses);
    }
  }

  private filterWallet(txs: ITransaction[], addresses: string[]) {
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
    return txs;
    }

    private filterEthereum(txs: ITransaction[], address: string) {
      txs.forEach((tx) => {
        if (tx.tx_input_n === 0) {
          tx.filtering_value = 'sent';
        } else {
          tx.filtering_value = 'received';
        }
      });
      return txs;
    }

    private goToTxDetails(tx: ITransaction[]) {
      console.log(tx);
      this.navCtrl.push('TransactionConfirmationPage', tx);
    }
  }
