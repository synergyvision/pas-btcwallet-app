import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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
import { AppData } from '../../app/app.data';
import { DecimalPipe } from '@angular/common';
import { ITransaction } from '../../app/interfaces/ITransaction';

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
  private min;
  private currency;
  private block: IBlockchain;
  private feeOptions = AppData.feeOptions;
  private metadataOptions = AppData.metadataOptions;
  private ethereum: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderService: LoaderService,
              private restService: RestService, private formBuilder: FormBuilder, private sharedService: SharedService,
              private alertService: AlertService, private translate: TranslateService, private events: Events) {
    this.getData();;
  }

  private getData() {
    this.min = 100000;
    this.currency = this.sharedService.currency;
    this.address = this.navParams.get('address');
    this.balance = this.navParams.get('wallet');
    this.sendForm = this.formBuilder.group({
      amount: [10000, Validators.compose([Validators.required, Validators.min(this.min)])],
      fee: [this.feeOptions[1], null],
      metadata: [null],
    });
    if (this.address.alias) {
      this.inputAddress = false;
    }
    this.ethereum = (this.balance.wallet.crypto.value === 'eth' || this.balance.wallet.crypto.value === 'tet');
  }

  private sendPayment(form: FormGroup) {
    // First we get an address from the recipient of the money
    this.loaderService.showFullLoader('LOADER.sending_payment');
    if (this.balance) {
      // If it is a QR Code or manually inputed address
      if (this.inputAddress) {
        this.createTransactionInput(form);
      } else {
        // If it is another wallet user
        this.createTransactionWalletUser(form);
      }
    }
  }

  private createTransactionInput(form: FormGroup) {
    this.sharedService.createPayment(this.address, form.value.amount, this.balance.wallet, form.value.feeOption)
    .subscribe((transaction) => {
      this.signPayment(transaction, form);
    }, (error) => {
      this.alertService.showError(error)
      .then(() => {
        // Do something
      })
      .catch(() => {
        // Do something
      });
    });
  }

  private createTransactionWalletUser(form: FormGroup) {
    this.sharedService.getWalletByEmail(this.address.email, this.balance.wallet.crypto.value,
      this.balance.wallet.multiSignedKey)
      .subscribe((receiverAddress) => {
        this.sharedService.createPayment(receiverAddress, form.value.amount,
          this.balance.wallet, form.value.fee.value)
          .subscribe((response) => {
            this.signPayment(response, form);
          });
        }, (error) => {
          this.loaderService.dismissLoader();
          this.alertService.showError(error)
          .then(() => {
            this.navCtrl.popToRoot();
          })
          .catch(() => {
            this.navCtrl.popToRoot();
          });
      });
  }

  private signPayment(transaction: ITransactionSke, form: FormGroup) {
    this.sharedService.sendPayment(transaction, this.balance.wallet)
      .subscribe((response: ITransactionSke) => {
        this.loaderService.dismissLoader();
        if (form.value.metadata !== '' && form.get('metadata').dirty) {
          this.addMetadata(form.value.metadata, response.tx.hash);
        }
        this.createEvent(response.tx.received, form.value.amount);
        this.navCtrl.push('TransactionConfirmationPage',
        { transaction: response.tx, wallet: this.balance.wallet });
      }, (error) => {
        this.loaderService.dismissLoader();
        this.message = this.translate.instant(error);
      });
  }

  private createEvent(tx, amount: number) {
    if (this.balance.wallet.multiSignedKey === '') {
      this.events.publish('user:paymentSent', amount, this.balance.wallet.crypto, tx);
    }
  }

  private addMetadata(metadata: string, transaction: string) {
    const data = { data: metadata };
    this.restService.putMetadata(transaction, this.balance.wallet.crypto.value, JSON.stringify(data))
    .subscribe((res) => {
      // Metadata added succesfully
    }, (metadataError) => {
      console.log(metadataError);
    });
  }

}
