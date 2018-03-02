import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ReceivePage } from '../receive/receive';
import { SendPage } from '../send/send';
import { User } from '../../app/models/user';
import { AuthService } from '../../app/services/auth.service';
import { RestService } from '../../app/services/rest.service';
import { Observable } from 'rxjs/Observable';
import { IBalance } from '../../app/models/IBalance';
import { LoaderService } from '../../app/services/loader.service';
import { ErrorService } from '../../app/services/error.service';
import { ITransactionSke } from '../../app/models/ITransaction';
import { Events } from 'ionic-angular/util/events';
import { Wallet } from '../../app/models/wallet';
import { AppData } from '../../app/app.data';
import { CreateWalletPage } from '../create-wallet/create-wallet';
import { EventService } from '../../app/services/events.services';

// Component for the Home Page, displays user balance, and options

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {

  private user: User;
  private error: ErrorService;
  private balances: IBalance[];
  private canCreateNewWallet: boolean = true;
  private currency: {};
  private wallets;

  constructor(public navCtrl: NavController, private restService: RestService, private authService: AuthService,
              private loaderService: LoaderService, private zone: NgZone, private events: Events) {
    this.loaderService.showFullLoader('Espere');
    this.currency = {
      name: 'USD',
      exchange: 8656,
    };
    this.getBalance()
    .then(() => {
      this.loaderService.dismissLoader();
    })
    .catch((error) => {
      this.handleError(Error);
      this.loaderService.dismissLoader();
    });
    this.events.subscribe('wallet:update', (wallet) => {
      this.updateWallet(wallet);
    });
  }

  public newUser() {
    this.events.publish('user:newUser');
  }

  public getBalance(): Promise<any> {
    // We get the balance from all of the user Wallets
    return new Promise((resolve, reject) => {
      this.authService.updateBalances()
      .subscribe((wallets) => {
        this.balances = wallets;
        console.log(wallets);
        if (this.balances.length > 6) {
          this.canCreateNewWallet = false;
        } else {
          this.canCreateNewWallet = true;
        }
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  private goToReceive(wallet) {
    this.navCtrl.push(ReceivePage, wallet);
  }

  private goToSend(balance) {
    this.navCtrl.push(SendPage, balance);
  }

  private updateWallet(wallet: string) {
    console.log('Wallet has been updated');
    const index = this.balances.findIndex((balance) => {
      return (balance.wallet.name === wallet);
    });
    this.authService.updateBalance(this.balances[index].wallet)
    .subscribe((newBalance) => {
      this.balances[index] = newBalance;
    });
  }

  private refresh(event) {
    this.getBalance()
    .then(() => {
      this.error = undefined;
      event.complete();
    }).catch(() => {
      event.complete();
    });
  }

  private createNewWallet() {
    this.navCtrl.push(CreateWalletPage);
  }

  private handleError(error) {
    if (error.message === 'CREATE_WALLET') {
      this.newUser();
    } else {
    // Error accessing REST Services
      this.error = error;
      this.wallets = this.authService.wallets;
    }
  }
}
