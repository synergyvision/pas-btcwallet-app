import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Component for Receiving BTC Page. Displays the user QR Code an address
@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})

export class ReceivePage {
  // Placeholder data for the view
  private direction: string;
  private code: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.code = 'assets/imgs/QRCode.png';
    this.direction = '1BPmau8ewds343Bgsds34jsS2fd342saTscqS232QrTscwqQecvbv';
  }

}
