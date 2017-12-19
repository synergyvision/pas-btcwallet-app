import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReceivePage } from '../receive/receive';
import { SendPage } from '../send/send';
import { User } from '../../models/user';

// Component for the Home Page, displays user balance, and options

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
  public user: User;

  constructor(public navCtrl: NavController) {

    // Placeholder user data
    this.user = new User(
    'nombre',
    'correo@correo.com',
    '1BPmau8ewds343Bgsds34jsS2fd342saTscqS232QrTscwqQecvbv',
    'assets/imgs/QRCode.png')
    ;
  }

  private goToReceive() {
    this.navCtrl.push(ReceivePage);
  }

  private goToSend() {
    this.navCtrl.push(SendPage);
  }

}
