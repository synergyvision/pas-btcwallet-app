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

// Component for the Home Page, displays user balance, and options

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {

  private user: User;
  private error: ErrorService;
  private balances;
  private canCreateNewWallet: boolean = true;

  constructor(public navCtrl: NavController, private restService: RestService, private authService: AuthService,
              private loaderService: LoaderService, private zone: NgZone, private events: Events) {
    this.loaderService.showFullLoader('Espere');
    this.getBalance();
  }

  public newUser() {
    this.events.publish('user:newUser');
  }

  public getBalance() {
    // We get the balance from all of the user Wallets
    this.error = undefined;
    this.authService.updateBalances()
      .subscribe((wallets) => {
        this.balances = wallets;
        if (this.balances.length > 6) {
          this.canCreateNewWallet = false;
        }
        this.loaderService.dismissLoader();
      }, (error) => {
        // New User, and has not created its first wallet
        if (error.message === 'CREATE_WALLET') {
          this.newUser();
        } else {
        // Error accessing REST Services
          this.error = error;
        }
        this.loaderService.dismissLoader();
      });
  }

  private ionViewWillEnter() {
    this.authService.updateBalances()
      .subscribe((balance) => {
        this.zone.run(() => {
          this.balances = balance;
          this.error = undefined;
        });
      });
  }

  private goToReceive(wallet) {
    this.navCtrl.push(ReceivePage, wallet);
  }

  private goToSend(balance) {
    console.log(balance);
    this.navCtrl.push(SendPage, balance);
  }

  private createNewWallet() {
    this.navCtrl.push(CreateWalletPage);
  }
}
