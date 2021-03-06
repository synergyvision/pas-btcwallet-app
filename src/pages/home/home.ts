import { Component, NgZone, ViewChild } from '@angular/core';
import { User } from '../../app/models/user';
import { RestService } from '../../app/services/rest.service';
import { LoaderService } from '../../app/services/loader.service';
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { Events } from 'ionic-angular/util/events';
import { Wallet } from '../../app/models/wallet';
import { AppData } from '../../app/app.data';
import { EventService } from '../../app/services/events.services';
import { ExchangeService } from '../../app/services/exchange.service';
import { SharedService } from '../../app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { IMSWalletRequest } from '../../app/models/multisignedWallet';
import { IBalance } from '../../app/interfaces/IBalance';
import { EACCES } from 'constants';
import { DecimalPipe } from '@angular/common';

// Component for the Home Page, displays user balance, and options

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
  @ViewChild(Slides) public slides: Slides;
  private user: User;
  private error: string;
  private balances: IBalance[];
  private canCreateNewWallet: boolean = true;
  private currency: string;
  private wallets;

  constructor(public navCtrl: NavController, private restService: RestService, private sharedService: SharedService,
              private loaderService: LoaderService, private zone: NgZone, private events: Events,
              private translate: TranslateService) {
    this.loaderService.showFullLoader('LOADER.wait');
    this.getBalance()
    .then(() => {
      this.loaderService.dismissLoader();
    })
    .catch((error) => {
      this.handleError(error);
      this.loaderService.dismissLoader();
    });
    this.events.subscribe('wallet:update', (wallet) => {
      this.updateWallet(wallet);
    });
    this.events.subscribe('home:refresh', () => {
      this.slides.slideTo(1);
    });
    // this.createRequest();
  }

/*   public createRequest() {
    const request: IMSWalletRequest = {};
    request.createdBy = 'a@a.com';
    request.crypto = 'tes';
    request.signers = ['a@a.com' , 'c@c.com'];
    request.accepted = ['a@a.com'];
    request.type = 'multisig-2-of-2';
    this.sharedService.addMultiSignedWalletRequest(request)
       .subscribe((data) => {
         console.log(data);
       });
  } */

  public newUser() {
    this.events.publish('user:newUser');
  }

  public getBalance(): Promise<any> {
    // We get the balance from all of the user Wallets
    return new Promise((resolve, reject) => {
      const balanceSub = this.sharedService.updateBalances()
      .subscribe((wallets) => {
          this.balances = wallets;
          this.canCreateNewWallet = !(this.balances.length > 6);
          this.getExchange();
          this.currency = this.sharedService.currency;
          balanceSub.unsubscribe();
          resolve();
      }, (error) => {
        balanceSub.unsubscribe();
        reject(error);
      });
    });
  }

  public getExchange() {
    this.sharedService.getCurrencyExchange(this.balances)
    .then((data) => {
      this.balances = data;
    });
  }

  private goToReceive(wallet) {
    this.navCtrl.push('ReceivePage', wallet);
  }

  private goToSend(balance) {
    this.navCtrl.push('SendPage', balance);
  }

  private updateWallet(wallet: string) {
    const index = this.balances.findIndex((balance) => {
      return (balance.wallet.name === wallet);
    });
    this.sharedService.updateBalance(this.balances[index].wallet)
    .subscribe((newBalance) => {
      this.balances[index] = newBalance;
    });
  }

  private refresh(event) {
    this.getBalance()
    .then(() => {
      this.error = undefined;
      event.complete();
    }).catch((error) => {
      this.handleError(error);
      event.complete();
    });
  }

  private createNewWallet() {
    this.navCtrl.push('CreateWalletPage');
  }

  private createNewMultiWallet() {
    this.navCtrl.push('CreateMultiwalletPage');
  }

  private goToWalletPage(b) {
    if (b.wallet && (b.wallet.multiSignedKey !== '' && b.wallet.multiSignedKey !== undefined)) {
      this.navCtrl.push('WalletPage', b.wallet);
    } else if (b.multiSignedKey !== '' && b.multiSignedKey !== undefined) {
     this.navCtrl.push('WalletPage', b);
    }
  }

  private handleError(error) {
    try {
      if (error === 'NO_WALLET') {
        this.newUser();
      } else {
      // Error accessing REST Services
        this.error = this.translate.instant(error);
        this.wallets = this.sharedService.wallets;
      }
    } catch (e) {
      this.error = this.translate.instant('ERROR.unknown');
    }
  }
}
