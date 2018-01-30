import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressBookPage } from '../address-book/address-book';
import { Events } from 'ionic-angular/util/events';
import { Address } from '../../app/models/address';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AlertService } from '../../app/services/alert.service';
import { RestService } from '../../app/services/rest.service';
import { SendConfirmPage } from '../send-confirm/send-confirm';
import { ErrorService } from '../../app/services/error.service';

@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  private selectedAddress: Address;
  private error = new ErrorService(null, 'CAMARA_ERROR');
  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              private qrScanner: QRScanner, private restService: RestService) {
    this.event.subscribe('selected:address', (addressData) => {
      this.selectedAddress = this.duplicateAddress(addressData);
    });
  }

  public goToAddress() {
    this.navCtrl.push(AddressBookPage);
  }

  public scanQRCode() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            // We must do something here with the address provided
            this.qrScanner.hide();
            scanSub.unsubscribe();
          });
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {

          this.restService.showAlert(this.error)
            .then((rest) => {
              // Implement method for getting user permissions on settings
              // camera permission was permanently denied
              // you must use QRScanner.openSettings() method to guide the user to the settings page
              // then they can grant the permission from there
              this.navCtrl.pop();
            });
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((error) => {
        this.restService.showAlert(this.error).then((rest) => {
          // Do nothing
        });
      });
  }
  private duplicateAddress(object: Address) {
    return new Address(object.alias, object.email, object.img );
  }

  private goToSendConfirm(address) {
    this.navCtrl.push(SendConfirmPage, address);
  }

}
