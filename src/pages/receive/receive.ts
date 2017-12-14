import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReceivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})

export class ReceivePage {
  private direction: string;
  private code: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.code = 'assets/imgs/QRCode.png';
    this.direction = '1BPmau8ewds343Bgsds34jsS2fd342saTscqS232QrTscwqQecvbv';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivePage');
  }
}
