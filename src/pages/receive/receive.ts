import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../app/services/loader.service';
import { RestService } from '../../app/services/rest.service';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import { AlertService } from '../../app/services/alert.service';
import { SharedService } from '../../app/services/shared.service';

// Component for Receiving BTC Page. Displays the user QR Code an address
@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})

export class ReceivePage {
  private address: string;
  private wallet;

  constructor(public navCtrl: NavController, private restService: RestService, private navParams: NavParams,
              private loaderService: LoaderService, private sharedService: SharedService,
              private alertService: AlertService) {
    // We show a loader while we check the data using the rest service
    this.loaderService.showFullLoader('LOADER.generating_code');
    // We check if last generated address was used for another transaction
    this.getAddress();

  }

  public getAddress() {
    const uid = this.sharedService.user.uid;
    this.wallet = this.navParams.data;
    // If it is an Ethereum wallet
    if (this.wallet.address) {
      this.showAddress();
    } else {
      this.getWalletAddress();
    }
  }

  public getWalletAddress() {
    // We get an address that has not been used
    this.restService.getUnusedAddressesWallet(this.wallet)
      .subscribe((address) => {
        this.address = address;
        this.loaderService.dismissLoader();
      }, (error) => {
        this.handleError(error);
      });
  }

  public showAddress() {
    this.address = this.wallet.address;
    this.restService.addFundsTestnet('0xb85a417b319c8294f5616dd6c28695eaeeefb337', 1000000000000000000, 'tet')
    .subscribe((data) => {
      console.log(data);
    });
    this.loaderService.dismissLoader();
  }

  public handleError(error) {
    this.loaderService.dismissLoader();
    this.alertService.showAlert(error)
    .then((res) => {
      this.navCtrl.pop();
    }, (err) => {
      this.navCtrl.pop();
    });
  }

}
