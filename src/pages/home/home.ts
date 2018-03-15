import { ITransactionSke } from '../../app/models/ITransaction';
import { Component, NgZone, ViewChild } from '@angular/core';
import { User } from '../../app/models/user';
import { RestService } from '../../app/services/rest.service';
import { Observable } from 'rxjs/Observable';
import { IBalance } from '../../app/models/IBalance';
import { LoaderService } from '../../app/services/loader.service';
import { ErrorService } from '../../app/services/error.service';
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { Events } from 'ionic-angular/util/events';
import { Wallet } from '../../app/models/wallet';
import { AppData } from '../../app/app.data';
import { EventService } from '../../app/services/events.services';
import { ExchangeService } from '../../app/services/exchange.service';
import { SharedService } from '../../app/services/shared.service';
import { ISigner, IMSWalletRequest } from '../../app/models/multisignedWallet';

// Component for the Home Page, displays user balance, and options

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
  @ViewChild(Slides) public slides: Slides;
  private user: User;
  private error: ErrorService;
  private balances: IBalance[];
  private canCreateNewWallet: boolean = true;
  private currency: {};
  private wallets;

  constructor(public navCtrl: NavController, private restService: RestService, private sharedService: SharedService,
              private loaderService: LoaderService, private zone: NgZone, private events: Events,
              private exchangeService: ExchangeService) {
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
    // this.createWallet();
  }
/* 
  public createRequest() {
    console.log('here');
    const request: IMSWalletRequest = {};
    request.createdBy = 'a@a.com';
    request.crypto = 'tet';
    request.signers = ['a@a.com' , 'c@c.com'];
    request.accepted = ['a@a.com'];
    request.type = 'multisig-2-2';
    this.sharedService.addMultiSignedWalletRequest(request)
       .subscribe((data) => {
         console.log(data);
       });
  } */

/*   public createWallet() {
    const data: ISigner[] = [
      { email: 'a@a.com', uid: 'pUH4YKUc6ZbZ8MIj0Dft5Hg14Wb2', pubKey: '' },
      { email: 'c@c.com', uid: 'VTxK5ZRyC7exB2i1xPfrVsQRPXa2', pubKey: '' },
    ];
    this.sharedService.createMultisignWallet('tes', 'multisig-2-of-2', data)
      .then((resolve) => {
      })
      .catch((error) => {
      });
  } */

  public newUser() {
    this.events.publish('user:newUser');
  }

  public getBalance(): Promise<any> {
    // We get the balance from all of the user Wallets
    return new Promise((resolve, reject) => {
      this.sharedService.updateBalances()
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
    }).catch(() => {
      event.complete();
    });
  }

  private createNewWallet() {
    this.navCtrl.push('CreateWalletPage');
  }

  private createNewMultiWallet() {
    this.navCtrl.push('CreateMultiwalletPage');
  }

  private handleError(error) {
    if (error.message === 'CREATE_WALLET') {
      this.newUser();
    } else {
    // Error accessing REST Services
      this.error = error;
      this.wallets = this.sharedService.wallets;
    }
  }
}
