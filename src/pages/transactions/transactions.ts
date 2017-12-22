import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Transaction } from '../../models/transaction';
import { RestService } from '../../app/rest.service';
import { IBlockchain } from '../../models/IBlockchain';

@IonicPage()
@Component({
  providers: [RestService],
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {

  public transactionList: Transaction[];
  public search: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService) {
    this.transactionList = [
      new Transaction(1, '12/12/2017', '34ryjhgcs35hjkjl3125lk34324s0944klnfcsjdfdsofkdofkdskfofssf', 0.3423, 0),
      new Transaction(2, '11/12/2017', '343sdsd12sed5jh343jhjhjh839281fhn19403nc903i3iencjdiofw0w24', 0.00023, 9.20),
      new Transaction(3, '09/12/2017', 'acbvy34fds353125ghgda3432sd24rewfwdqw432|7684rerqecxz231414', 0.00000232, 3.40),
    ];
  }
}
