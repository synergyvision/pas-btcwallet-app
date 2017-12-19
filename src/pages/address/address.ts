import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms/src/model';
import { Address } from '../../models/address';

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})

// Component for displaying and changing one addresse

export class AddressPage {
  private address: Address;
  private action: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {

    // Var for knowing the data sent by the parent
    let response = this.navParams.data;

    // Empty user address to avoid undefined error on the View
    this.address = new Address(0, '../../assets/imgs/user.png', '', '');

    // If parent sends empty data, then add a new address
    if (response.id === undefined) {
      this.action = 'Agregar ';
    // Else, we can modify the address
    } else {
      this.address = this.duplicateAddress(response);
    }
  }

  // Save changes to the address
  private saveAddress() {
    this.event.publish('added:address', this.address);
    this.navCtrl.pop();
  }

  // Creates a copy of the address sent by the parent to be modified by the user
  private duplicateAddress(object) {
    return new Address(object.id, object.img, object.alias, object.address);
  }
}
