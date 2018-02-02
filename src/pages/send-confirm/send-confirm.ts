import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { LoaderService } from '../../app/services/loader.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { Address } from '../../app/models/address';
import { ITransacionSke } from '../../app/models/ITransaction';
import { Transaction } from '../../app/models/transaction';


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
       this.createTransactionWalletUser(form);
      // If it is a QR Code or manually inputted address
    }
  }

  private createTransactionWalletUser(form: FormGroup) {
    this.authService.getWalletAddress(this.address.email)
      .subscribe((receiverAddress) => {
          console.log(receiverAddress);
          this.restService.sendPayment(receiverAddress.chains[0].chain_addresses.pop().address, form.value.amount,
          this.balance.wallet)
          .subscribe((response) => {
            this.signPayment(response);
          });
        }, (error) => {
          console.log(error);
      });
  }

  private signPayment(transaction: ITransacionSke) {
    this.authService.signTransaction(transaction);
  }

}
