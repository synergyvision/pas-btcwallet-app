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
export class AddressBookPage {

  private addressBook: Address[];
  private selectAddress: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {
    this.addressBook = [
      new Address(1, '../../assets/imgs/user.png', 'alias 1', '42sdsvgf93ghg823'),
      new Address(2, '../../assets/imgs/user.png', 'alias 2', 'acnjsdnjwsdsjdsd'),
      new Address(3, '../../assets/imgs/user.png', 'alias 3', 'dfje4y7837yjsdcx'),
    ];
    this.event.subscribe('added:address', (addressData) => {
      this.addressBook.push(addressData);
    });
    if (this.navCtrl.last().name === 'SendPage') {
      this.selectAddress = true;
    }
  }

  private addAddress() {
    this.navCtrl.push(AddressPage);
  }

  private openAddress(address) {
    if (this.selectAddress) {
      this.event.publish('selected:address', address);
      this.navCtrl.pop();
    } else {
      this.navCtrl.push(AddressPage, address);
    }

  }

  private removeAddress(address) {
    let index = this.addressBook.indexOf(address);
    if (index > -1) {
      this.addressBook.splice(index, 1);
    }
  }
}
