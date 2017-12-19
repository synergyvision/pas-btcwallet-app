import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { Address } from '../../models/address';
import { SendPage } from '../send/send';

@IonicPage()
@Component({
  selector: 'page-address-book',
  templateUrl: 'address-book.html',
})

// Component that displays all of the registered user´s addresses

export class AddressBookPage {

  private addressBook: Address[];
  private selectAddress: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {

    // Placeholder Addressess for displaying data
    this.addressBook = [
      new Address(1, '../../assets/imgs/user.png', 'alias 1', '42sdsvgf93ghg823'),
      new Address(2, '../../assets/imgs/user.png', 'alias 2', 'acnjsdnjwsdsjdsd'),
      new Address(3, '../../assets/imgs/user.png', 'alias 3', 'dfje4y7837yjsdcx'),
    ];

    // Listener for event for updating the list
    // Comes from AddressPage, and the data is the new Address data
    this.event.subscribe('added:address', (addressData) => {
      this.addressBook.push(addressData);
    });

    // If this view parent is SendPage, then we select an Address for sending BTC or CC
    if (this.navCtrl.last().name === 'SendPage') {
      this.selectAddress = true;
    }
  }

  // Pushes a new Address to the Address List
  private addAddress() {
    this.navCtrl.push(AddressPage);
  }

  // Opens AddressPage or selects an Address for SendPage
  private openAddress(address) {
    // Sends the selected Address to SendPage (the parent)
    if (this.selectAddress) {
      this.event.publish('selected:address', address);
      this.navCtrl.pop();
    // Else, opens AddressPage with a selected Address to be seen or modified
    } else {
      this.navCtrl.push(AddressPage, address);
    }

  }

  // Deletes an Address from the Address List
  private removeAddress(address) {
    let index = this.addressBook.indexOf(address);
    if (index > -1) {
      this.addressBook.splice(index, 1);
    }
  }
}
