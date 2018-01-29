import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../app/services/loader.service';
import { RestService } from '../../app/services/rest.service';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../app/services/auth.service';
import { IWallet } from '../../app/models/IWallet';
import { AlertService } from '../../app/services/alert.service';

// Component for Receiving BTC Page. Displays the user QR Code an address
@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})

export class ReceivePage {
  private address: Observable<IWallet>;

  constructor(public navCtrl: NavController, public dataProvider: FirebaseProvider, private restService: RestService,
              private loaderService: LoaderService, private authService: AuthService) {

    // We show a loader while we check the data using the rest service
    this.loaderService.showFullLoader('Generando Código');
    const uid = this.authService.user.uid;
    // We get the user uid Wallet
    this.dataProvider.getWallets(uid)
      // We check if the last generated key had a transaction
      .subscribe((data) => {
        // Rest Service returns either last generated address (if no transactions were made)
        // or a new address
        this.restService.verifyAddress(data[0], uid)
          .subscribe((address) => {
            // We use this address to generare QR CODE on componente view
            this.address = address;
            this.loaderService.dismissLoader();
          },
          (error) => {
            // If there was a problem accessing the rest API
            this.loaderService.dismissLoader();
            this.restService.showAlert(error).then((res) => {
              this.navCtrl.pop();
            },
              (err) => {
                this.navCtrl.pop();
              });
          });
      });
}

}
