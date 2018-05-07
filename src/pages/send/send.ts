import { RestService } from '../../app/services/rest.service';
import { Component } from '@angular/core';
import { Events } from 'ionic-angular/util/events';
import { Address } from '../../app/models/address';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AlertService } from '../../app/services/alert.service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../app/services/loader.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../app/services/auth.service';
import { SharedService } from '../../app/services/shared.service';
import { AppData } from '../../app/app.data';

@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  private selectedAddress: Address;
  private selectAddressForm: FormGroup;
  private inputError: string;
  private inputAddress: string;
  private token: boolean;
  private inputs: any[];
  private cameraIsOpen: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              private qrScanner: QRScanner, private formBuilder: FormBuilder, private alertService: AlertService,
              private restService: RestService, private loaderService: LoaderService, private authService: AuthService,
              private translate: TranslateService, private sharedService: SharedService) {
    this.inputs =  AppData.selectAddressForm;
    // If the user has not activated the 2FA, we remove this input
    if (this.sharedService.user.token.activated === false) {
      this.inputs =  AppData.selectAddressForm.filter((i) => {
        return i.name !== 'token';
      });
    }
    // We build the Form
    this.selectAddressForm = this.formBuilder.group({});
    this.inputs.forEach((control) => {
      this.selectAddressForm.addControl(control.name, new FormControl(control.value));
      this.selectAddressForm.controls[control.name].setValidators(control.validators);
    });

    // If we are coming back from the Address Book Page, we have selected an Address
    this.event.subscribe('selected:address', (addressData) => {
      // We disable the form
      this.selectAddressForm.reset();
      this.selectAddressForm.controls.inputAddress.disable();
      this.selectedAddress = this.duplicateAddress(addressData);

    });
  }

  public goToAddress() {
    this.navCtrl.push('AddressBookPage');
  }

  public backButtonAction() {
    /* checks if modal is open */
    console.log(this.qrScanner);
    if (this.cameraIsOpen) {
        /* closes modal */
        this.qrScanner.hide();
        window.document.querySelector('ion-app').classList.remove('transparent-body');
        this.cameraIsOpen = false;
    } else {
        this.navCtrl.pop();
    }
  }

  public scanQRCode() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          const scanSub = this.qrScanner.scan()
          .subscribe((text: string) => {
            this.inputAddress = text;
            this.validateInputedAddress(text);
            this.qrScanner.hide();
            window.document.querySelector('ion-app').classList.remove('transparent-body');
            scanSub.unsubscribe();
            this.cameraIsOpen = false;
          });
          this.cameraIsOpen = true;
          this.qrScanner.show();
          window.document.querySelector('ion-app').classList.add('transparent-body');
          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          this.alertService.showError('ERROR.CAMERA.permission')
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
        // We need to handle the errors from https://github.com/bitpay/cordova-plugin-qrscanner
        this.alertService.showError(this.cameraError(error.name))
        .then((rest) => {
          // Do nothing
        });
      });
  }

  private validateForm(form: FormGroup) {
    this.validateToken(form.value.token)
    .then(() => {
      this.validateAddress(form.value.inputAddress);
    })
    .catch((error) => {
      this.inputError = this.translate.instant(error);
      this.selectAddressForm.value.token = undefined;
    });
  }

  private validateToken(token?: number): Promise<any> {
    if (token !== undefined) {
      return this.authService.validate2FAU(token);
    }
    return Promise.resolve();
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
    this.restService.getAddressBalance(address, this.navParams.data.wallet.crypto.value)
      .subscribe((response) => {
        this.goToSendConfirm(address);
      }, (error) => {
        this.inputError = this.translate.instant(error);
      });
  }

  private goToSendConfirm(address) {
    this.navCtrl.push('SendConfirmPage', {address, wallet: this.navParams.data});
  }

  private cameraError(error: string): string {
    // Manages the errors from https://github.com/bitpay/cordova-plugin-qrscanner
    if (error === undefined) {
      return 'ERROR.CAMERA.unknown_error';
    } else if (error.includes('CAMERA_UNAVAILABLE')) {
        return 'ERROR.CAMERA.unavailable';
    } else if (error.includes('DENIED') || (error.includes('RESTRICTED'))) {
        return 'ERROR.CAMERA.permission';
    } else if (error === 'SCAN_CANCELED') {
        return 'ERROR.CAMERA.scan_canceled';
    } else {
        return 'ERROR.CAMERA.unknown_error';
    }
  }



}
