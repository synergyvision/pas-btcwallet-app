import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { SharedService } from '../../app/services/shared.service';
import { IBalance } from '../../app/models/IBalance';
import { Wallet } from '../../app/models/wallet';
import { ExchangeService } from '../../app/services/exchange.service';
import { IExchange } from '../../app/models/IExchange';


@IonicPage()
@Component({
  selector: 'page-exchange',
  templateUrl: 'exchange.html',
})
export class ExchangePage {

  private balances: IBalance[];
  private walletList: Wallet[];
  private walletDestinationList: Wallet[];
  private originWallet;
  private destinationWallet;
  private originBalance: IBalance;
  private destinationBalance: IBalance;
  private currency: any;
  private exchangeRate: IExchange;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
              private sharedService: SharedService, private exchangeService: ExchangeService) {
      this.balances =  this.sharedService.balances;
      this.walletList = this.walletDestinationList = this.sharedService.wallets;
      this.currency = {
        name: 'USD',
        exchange: 8656,
      };
  }

  private onWalletSelect() {
    console.log(this.destinationWallet);
    console.log(this.originWallet);
    if (this.destinationWallet === undefined) {
      this.originBalance = this.findBalance(this.originWallet, this.walletList);
      const index = this.walletDestinationList.indexOf(this.originWallet);
    } else {
      this.exchangeService.getExchangeRate(this.originWallet.crypto.value,
        this.destinationWallet.crypto.value)
        .subscribe((exchange) => {
          this.exchangeRate = exchange;
        });
      this.destinationBalance = this.findBalance(this.destinationWallet, this.walletDestinationList);
    }
  }

  private findBalance(wallet: Wallet, walletList: Wallet[]): IBalance {
    return this.balances.find((balance) => {
      return balance.wallet.name === wallet.name;
    });
  }

}
