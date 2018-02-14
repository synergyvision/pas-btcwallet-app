import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { LoaderService } from '../../app/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { Address } from '../../app/models/address';
import { ITransactionSke } from '../../app/models/ITransaction';
import { Transaction } from '../../app/models/transaction';
import { AlertService } from '../../app/services/alert.service';
import { TransactionConfirmationPage } from '../transaction-confirmation/transaction-confirmation';
import { IBalance } from '../../app/models/IBalance';

@IonicPage()
@Component({
  selector: 'page-send-confirm',
  templateUrl: 'send-confirm.html',
})
export class SendConfirmPage {

  private address;
  private balance: IBalance;
  private sendForm: FormGroup;
  private inputAddress = true;
  private message: string;
  private unit;
  private currency;
  private fee;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderService: LoaderService,
              private restService: RestService, private formBuilder: FormBuilder, private authService: AuthService,
              private alertService: AlertService) {
    this.loaderService.showFullLoader('Espere');
    this.unit = {
      name: 'sat',
      exchange: 1,
    };
    this.currency = {
      name: 'USD',
      exchange: 10700,
    };
    this.fee = 60000;
    this.sendForm = this.formBuilder.group({
      amount: [10000, Validators.compose([Validators.required, Validators.min(this.fee)])],
      fee: [this.fee, null],
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
    this.loaderService.showFullLoader('Realizando Pago');
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
        this.restService.createPayment(receiverAddress.chains[0].chain_addresses.pop().address, form.value.amount,
          this.balance.wallet)
          .subscribe((response) => {
            this.signPayment(response);
          });
        }, (error) => {
          console.log(error);
      });
  }

  private signPayment(transaction: ITransactionSke) {
    this.authService.sendPayment(transaction)
      .subscribe((response) => {
        console.log(response);
        this.loaderService.dismissLoader();
        this.navCtrl.push(TransactionConfirmationPage, response);
      }, (error) => {
        this.loaderService.dismissLoader();
        this.message = error;
      });
  }

}
