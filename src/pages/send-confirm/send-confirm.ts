import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { LoaderService } from '../../app/services/loader.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { Address } from '../../app/models/address';


/**
 * Generated class for the SendConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-confirm',
  templateUrl: 'send-confirm.html',
})
export class SendConfirmPage {

  private address: Address;
  private balance;
  private sendForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderService: LoaderService,
              private restService: RestService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.loaderService.showFullLoader('Espere');
    this.sendForm = this.formBuilder.group({
      amount: [1000, Validators.compose([Validators.required, Validators.min(10000)])],
    });
    this.address = this.navParams.data;
    this.authService.balance
    .subscribe((balance) => {
      this.balance = balance;
      this.loaderService.dismissLoader();
    });
  }

  private sendPayment(form: FormGroup) {
    // First we get an address from the recipient of the money
    if (this.balance) {
      // If it is another wallet user
      // this.authService.getWalletAddress(this.address.email).subscribe((wallet) => {
      //  this.restService.sendPayment(this.balance.chains.chain_address.pop().address,
      //  form.value.amount, this.balance.wallet)
      //  .subscribe((response) => {
      //    console.log(response);
      //  });
      // });
      // If it is a QR Code or manually inputted address
    }
  }

}
