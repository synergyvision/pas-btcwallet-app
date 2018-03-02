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
import { ErrorService } from '../../app/services/error.service';

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
  private error: ErrorService;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderService: LoaderService,
              private restService: RestService, private formBuilder: FormBuilder, private authService: AuthService,
              private alertService: AlertService) {
    this.currency = {
      name: 'USD',
      exchange: 8656,
    };
    this.fee = this.calculateMinFee();
    this.sendForm = this.formBuilder.group({
      amount: [10000, Validators.compose([Validators.required, Validators.min(this.fee)])],
      fee: [this.fee, null],
    });
    this.address = this.navParams.get('address');
    this.balance = this.navParams.get('wallet');
    if (this.address.alias) {
      this.inputAddress = false;
    }
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
    this.authService.getWalletByEmail(this.address.email, this.balance.wallet.crypto.value)
      .subscribe((receiverAddress) => {
        console.log(receiverAddress);
        this.restService.createPayment(receiverAddress, form.value.amount,
          this.balance.wallet)
          .subscribe((response) => {
            this.signPayment(response);
          });
        }, (error: ErrorService) => {
          this.loaderService.dismissLoader();
          this.alertService.showAlert(error.message, error.title, error.subTitle)
          .then(() => {
            this.navCtrl.popToRoot();
          });

      });
  }

  private signPayment(transaction: ITransactionSke) {
    this.authService.sendPayment(transaction, this.balance.wallet)
      .subscribe((response) => {
        console.log(response);
        this.loaderService.dismissLoader();
        this.navCtrl.push(TransactionConfirmationPage, response);
      }, (error) => {
        this.loaderService.dismissLoader();
        this.message = error;
      });
  }

  private calculateMinFee() {
    // We calculate the minimun fee
    // Blockcypher uses 
    return 50000;
  }

}
