import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReceivePage } from '../receive/receive';
import { SendPage } from '../send/send';
import { RestService } from '../../app/services/rest.service';
import { User } from '../../app/models/user';

// Component for the Home Page, displays user balance, and options

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {

  private user: User;

  constructor(public navCtrl: NavController, private restService: RestService) {
    this.user = this.restService.user;
  }

  private goToReceive() {
    this.navCtrl.push(ReceivePage);
  }

  private goToSend() {
    this.navCtrl.push(SendPage);
  }

  private ngOnInit() {
    this.user = this.restService.user;
  }

}
