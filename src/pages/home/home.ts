
import { Component, NgZone, ViewChild } from '@angular/core';
import { User } from '../../app/models/user';
import { RestService } from '../../app/services/rest.service';
import { Observable } from 'rxjs/Observable';
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
  private currency: {};
  private wallets;

  constructor(public navCtrl: NavController, private restService: RestService, private sharedService: SharedService,
              private loaderService: LoaderService, private zone: NgZone, private events: Events,
              private translate: TranslateService) {
    this.loaderService.showFullLoader('LOADER.wait');
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
    /* this.restService.getMetadata('4042d167a9ee21eca150e8f08fe7f2a4eb5bfee101222161c1f2a1fe159c8028',
    'bcy')
    .subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    }); */
  }

  public createRequest() {
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
  }

  public newUser() {
    this.events.publish('user:newUser');
  }

  public getBalance(): Promise<any> {
    // We get the balance from all of the user Wallets
    return new Promise((resolve, reject) => {
      this.sharedService.updateBalances()
      .subscribe((wallets) => {
        this.balances = wallets;
        if (this.balances.length > 6) {
          this.canCreateNewWallet = false;
        } else {
          this.canCreateNewWallet = true;
        }
        resolve();
      }, (error) => {
        console.log(error);
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
