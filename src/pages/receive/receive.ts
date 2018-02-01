import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../app/services/loader.service';
import { RestService } from '../../app/services/rest.service';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../app/services/auth.service';
import { IHDWallet } from '../../app/models/IHDWallet';
import { AlertService } from '../../app/services/alert.service';

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
              private loaderService: LoaderService, private authService: AuthService) {

    // We show a loader while we check the data using the rest service
    this.loaderService.showFullLoader('Generando Código');
    // We check if last generated address was used for another transaction
    this.getAddress();

  }

  public getAddress() {
    const uid = this.authService.user.uid;
    this.wallet = this.navParams.data.wallet;
    this.restService.getAddressBalance(this.wallet.addresses.pop())
      .subscribe((data) => {
        if (data.n_tx > 0) {
          this.restService.deriveAddress(this.wallet.name)
          .subscribe((newAddress) => {
            this.loaderService.dismissLoader();
            this.address = newAddress.address;
          }, (err) => {
            this.handleError(err);
          });
        } else {
          this.loaderService.dismissLoader();
          this.address = data.address;
        }
      }, (error) => {
        this.handleError(error);
      });
  }

  public handleError(error) {
    this.loaderService.dismissLoader();
    this.restService.showAlert(error).then((res) => {
      this.navCtrl.pop();
    }, (err) => {
      this.navCtrl.pop();
    });
  }
}
