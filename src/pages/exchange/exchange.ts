import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedService } from '../../app/services/shared.service';
import { Wallet } from '../../app/models/wallet';
import { ExchangeService } from '../../app/services/exchange.service';
import { IBalance } from '../../app/interfaces/IBalance';
import { IExchange } from '../../app/interfaces/IExchange';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../app/services/alert.service';


@IonicPage()
@Component({
  selector: 'page-exchange',
  templateUrl: 'exchange.html',
})
export class ExchangePage {

  private balances: IBalance[];
  private walletList: Wallet[];
  private walletDestinationList: Wallet[];
  private originWallet: Wallet;
  private destinationWallet: Wallet;
  private originBalance: IBalance;
  private destinationBalance: IBalance;
  private currency: any;
  private exchangeRate: IExchange;
  private amount: number = 0;
  private error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
              private sharedService: SharedService, private exchangeService: ExchangeService,
              private translate: TranslateService, private alertService: AlertService) {
      this.balances =  this.sharedService.balances;
      if (this.balances === undefined) {
        this.error = this.translate.instant('ERROR.no_internet');
      }
      this.walletList = this.walletDestinationList = this.sharedService.wallets;
      this.currency = {
        name: 'USD',
        exchange: 381.23,
      };
  }

  private onOriginWalletSelect() {
    this.originBalance = this.findBalance(this.originWallet, this.walletList);
    console.log(this.originBalance);
    this.filterWallets(this.originWallet.crypto.coin);
  }

  private onDestinationWalletSelect() {
    console.log(this.destinationWallet);
    console.log(this.originWallet);
    this.exchangeService.getExchangeRate(this.originWallet.crypto.value,
      this.destinationWallet.crypto.value)
      .subscribe((exchange) => {
        this.exchangeRate = exchange;
        console.log(exchange);
      }, (error) => {
        this.alertService.showError(error)
        .then(() => {
          this.navCtrl.pop();
        });
      });
    this.destinationBalance = this.findBalance(this.destinationWallet, this.walletDestinationList);
  }

  private filterWallets(crypto: string) {
    this.destinationWallet = undefined;
    this.walletDestinationList = this.walletList.filter((w) => {
      return w.crypto.coin !== crypto;
    });
  }

  private findBalance(wallet: Wallet, walletList: Wallet[]): IBalance {
    return this.balances.find((balance) => {
      return balance.wallet.name === wallet.name;
    });
  }

}
