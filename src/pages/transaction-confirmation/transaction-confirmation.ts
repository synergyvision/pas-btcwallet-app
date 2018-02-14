import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ITransaction } from '../../app/models/ITransaction';

/**
 * Generated class for the TransactionConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-confirmation',
  templateUrl: 'transaction-confirmation.html',
})
export class TransactionConfirmationPage {

  private transaction: ITransaction;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.transaction = navParams.data.tx;
    console.log(this.transaction);
  }

  private goBack() {
    this.navCtrl.popToRoot();
  }

}
