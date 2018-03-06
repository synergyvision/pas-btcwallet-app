import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-exchange',
  templateUrl: 'exchange.html',
})
export class ExchangePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangePage');
  }

}
