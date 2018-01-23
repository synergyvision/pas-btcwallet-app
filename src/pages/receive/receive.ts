import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../app/services/loader.service';
import { RestService } from '../../app/services/rest.service';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../app/services/auth.service';
import { IWallet } from '../../app/models/IWallet';

// Component for Receiving BTC Page. Displays the user QR Code an address
@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})

export class ReceivePage {
  private address: Observable<IWallet>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderService: LoaderService,
              private restService: RestService, private dataProvider: FirebaseProvider,
              private authService: AuthService) {
    this.loaderService.showLoader('Generando Código');
    // First we need to check if the last generated key had a transaction
    const uid = this.authService.user.uid;
    this.dataProvider.getWallets(uid)
    .subscribe((data) => {
      this.restService.verifyAddress(data[0], uid)
        .subscribe((address) => {
          this.address = address;
          this.loaderService.dismissLoader();
        });

    });

  }

}
