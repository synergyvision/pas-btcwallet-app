import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/services/rest.service';
import { Transaction } from '../../app/models/transaction';

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
    this.transactionList = this.restService.transactionList;
  }
}
