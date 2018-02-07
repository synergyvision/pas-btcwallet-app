import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
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

// Component for the Home Page, displays user balance, and options

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {

  private user: User;
  private balance: IBalance;
  private error: ErrorService;

  constructor(public navCtrl: NavController, private restService: RestService, private authService: AuthService,
              private loaderService: LoaderService, private zone: NgZone) {
    this.loaderService.showFullLoader('Espere');
    this.getBalance();
  }

  public getBalance() {
    this.authService.updateBalance()
    .subscribe((balance) => {
      console.log(balance);
      this.balance = balance;
      this.loaderService.dismissLoader();
      // this.transactionTest();
      this.error = undefined;
    }, (error) => {
      this.loaderService.dismissLoader();
      this.error = error;
    });
  }

  public transactionTest() {
    this.restService.createPayment('ms1B2JHax816JWRY9WUQ7Foojcy7mZ3WCo', 300000, this.balance.wallet)
      .subscribe((response) => {
        this.authService.sendPayment(response);
      }, (error) => {
        this.error = undefined;
      });
  }

 /*  private ionViewWillEnter() {
    this.authService.getBalance();
    this.authService.balance
    .subscribe((balance) => {
      this.zone.run(() => {
        this.balance = balance;
        this.error = undefined;
      });
    });
  } */

  private goToReceive() {
    this.navCtrl.push(ReceivePage, this.balance);
  }

  private goToSend() {
    this.navCtrl.push(SendPage);
  }
}
