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
import { LoaderService } from '../../app/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  private selectedAddress: Address;
  private cameraError = new ErrorService(null, 'CAMARA_ERROR');
  private selectAddressForm: FormGroup;
  private inputError: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              private qrScanner: QRScanner, private formBuilder: FormBuilder, private alertService: AlertService,
              private restService: RestService, private loaderService: LoaderService) {
    this.event.subscribe('selected:address', (addressData) => {
      this.selectedAddress = this.duplicateAddress(addressData);
      this.selectAddressForm.disable();
      this.selectAddressForm.reset();
    });
    this.selectAddressForm = this.formBuilder.group({
      inputAddress: ['', Validators.compose([Validators.maxLength(42), Validators.minLength(24), Validators.required])],
    });
  }

  public goToAddress() {
    this.navCtrl.push(AddressBookPage);
  }

  public scanQRCode() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          const scanSub = this.qrScanner.scan()
          .subscribe((text: string) => {
            // We must do something here with the address provided
            console.log(text);
            this.validateInputedAddress(text);
            this.qrScanner.hide();
            scanSub.unsubscribe();
          });
          this.qrScanner.show();
          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          this.alertService.showAlert(this.cameraError)
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
        this.alertService.showAlert(error).then((rest) => {
          // Do nothing
        });
      });
  }

  private validateAddress(address: string) {
    if (this.selectedAddress === undefined) {
      this.validateInputedAddress(address);
    } else {
      this.goToSendConfirm(this.selectedAddress);
    }
  }
  private duplicateAddress(object: Address) {
    return new Address(object.alias, object.email, object.img );
  }

  private validateInputedAddress(address: string) {
    // We check that the address is a BTC Valid Address
    this.restService.getAddressBalance(address, this.navParams.data.crypto.value)
      .subscribe((response) => {
        this.navCtrl.push(SendConfirmPage, address);
      }, (error) => {
        this.inputError = 'Esta dirección no es válida';
      });
  }

  private goToSendConfirm(address) {
    this.navCtrl.push(SendConfirmPage, {address: address, wallet: this.navParams.data});
  }

}
