import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { LoaderService } from '../../app/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { Address } from '../../app/models/address';
import { ITransactionSke } from '../../app/models/ITransaction';
import { Transaction } from '../../app/models/transaction';

@IonicPage()
@Component({
  selector: 'page-send-confirm',
  templateUrl: 'send-confirm.html',
})
export class SendConfirmPage {

  private address;
  private balance;
  private sendForm: FormGroup;
  private inputAddress = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderService: LoaderService,
              private restService: RestService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.loaderService.showFullLoader('Espere');
    this.sendForm = this.formBuilder.group({
      amount: [10000, Validators.compose([Validators.required, Validators.min(10000)])],
    });
    this.address = this.navParams.data;
    if (this.address.alias) {
      this.inputAddress = false;
    }
    this.authService.updateBalance()
    .subscribe((balance) => {
      this.balance = balance;
      this.loaderService.dismissLoader();
    });
  }

  private sendPayment(form: FormGroup) {
    // First we get an address from the recipient of the money
    if (this.balance) {
      // If it is a QR Code or manually inputted address
      if (this.inputAddress) {
        this.createTransactionInput(form);
      } else {
        // If it is another wallet user
        this.createTransactionWalletUser(form);
      }
    }
  }

  private createTransactionInput(form: FormGroup) {
    this.restService.createPayment(this.address, form.value.amount, this.balance.wallet)
    .subscribe((transaction) => {
      this.signPayment(transaction);
    }, (error) => {
      console.log(error);
    });
  }

  private createTransactionWalletUser(form: FormGroup) {
    this.authService.getWalletByEmail(this.address.email)
      .subscribe((receiverAddress) => {
        console.log("Monto a transferir");
        console.log(form.value.amount);
        console.log('Billetera que va a pagar');
        console.log('this.balance.wallet');
        console.log('Recipiente');
        console.log(receiverAddress);
        console.log(receiverAddress.chains[0].chain_addresses.pop().address);
        this.restService.createPayment(receiverAddress.chains[0].chain_addresses.pop().address, form.value.amount,
          this.balance.wallet)
          .subscribe((response) => {
            console.log('TX Skeleton de la transaccion');
            console.log(response);
            this.signPayment(response);
          });
        }, (error) => {
          console.log(error);
      });
  }

  private signPayment(transaction: ITransactionSke) {
    this.authService.sendPayment(transaction);
  }

}
