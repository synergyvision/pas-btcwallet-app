import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { LoaderService } from '../../app/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../app/models/address';
import { Transaction } from '../../app/models/transaction';
import { AlertService } from '../../app/services/alert.service';
import { SharedService } from '../../app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ITransactionSke } from '../../app/interfaces/ITransactionSke';
import { IBalance } from '../../app/interfaces/IBalance';
import { IBlockchain } from '../../app/interfaces/IBlockchain';
import { IToken } from '../../app/models/user';

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
  private block: IBlockchain;
  private feeOptions: any[] = ['Low', 'Medium', 'High'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderService: LoaderService,
              private restService: RestService, private formBuilder: FormBuilder, private sharedService: SharedService,
              private alertService: AlertService, private translate: TranslateService) {
    this.currency = {
      name: 'USD',
      exchange: 8656,
    };
    this.fee = 5000;
    this.sendForm = this.formBuilder.group({
      amount: [10000, Validators.compose([Validators.required, Validators.min(this.fee)])],
      fee: [this.fee, null],
      metadata: ['Metadata', null],
      feeOption: ['FeeOption', null],
    });
    this.address = this.navParams.get('address');
    this.balance = this.navParams.get('wallet');
    if (this.address.alias) {
      this.inputAddress = false;
    }
  }

  private sendPayment(form: FormGroup) {
    // First we get an address from the recipient of the money
    this.loaderService.showFullLoader('LOADER.sending_payment');
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
    this.sharedService.createPayment(this.address, form.value.amount, this.balance.wallet)
    .subscribe((transaction) => {
      this.signPayment(transaction, form);
    }, (error) => {
      console.log(error);
    });
  }

  private createTransactionWalletUser(form: FormGroup) {
    this.sharedService.getWalletByEmail(this.address.email, this.balance.wallet.crypto.value,
      this.balance.wallet.multiSignedKey)
      .subscribe((receiverAddress) => {
        this.sharedService.createPayment(receiverAddress, form.value.amount,
          this.balance.wallet)
          .subscribe((response) => {
            this.signPayment(response, form);
          });
        }, (error) => {
          this.loaderService.dismissLoader();
          this.alertService.showError(error)
          .then(() => {
            this.navCtrl.popToRoot();
          });

      });
  }

  private signPayment(transaction: ITransactionSke, form: FormGroup) {
    this.sharedService.sendPayment(transaction, this.balance.wallet)
      .subscribe((response) => {
        this.loaderService.dismissLoader();
        if (form.value.metadata !== '') {
          const metadata = { data: form.value.data };
          this.restService.putMetadata(transaction.tx.hash, this.balance.wallet.crypto.value, JSON.stringify(metadata))
          .subscribe((res) => {
            console.log(res);
          });
        }
        this.navCtrl.push('TransactionConfirmationPage', response.tx);
      }, (error) => {
        console.log(error);
        this.loaderService.dismissLoader();
        this.message = this.translate.instant(error);
      });
  }

}
