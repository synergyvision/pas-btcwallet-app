import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms/src/model';
import { Address } from '../../models/address';

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

  private address: Address;
  private action: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {
    let response = this.navParams.data;
    this.address = new Address(0, '../../assets/imgs/user.png', '', '');
    if (response.id === undefined) {
      this.action = 'Agregar ';
    } else {
      this.address = this.duplicateAddress(response);
    }
  }

  private saveAddress() {
    this.event.publish('added:address', this.address);
    this.navCtrl.pop();
  }

  private duplicateAddress(object) {
    return new Address(object.id, object.img, object.alias, object.address);
  }
}
