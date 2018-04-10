import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ITransaction } from '../../app/interfaces/ITransaction';


@IonicPage()
@Component({
  selector: 'page-transaction-confirmation',
  templateUrl: 'transaction-confirmation.html',
})
export class TransactionConfirmationPage {

  private transaction: ITransaction;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.transaction = navParams.data;
    console.log(navParams.data);
    console.log(this.transaction);
  }

  private goBack() {
    this.navCtrl.popToRoot();
  }

}
