import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressBookPage } from '../address-book/address-book';
import { Events } from 'ionic-angular/util/events';
import { Address } from '../../app/models/address';

@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {

  private selectedAddress: Address;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {
    this.selectedAddress = new Address(0, '../../assets/imgs/user.png', '', '');
    this.event.subscribe('selected:address', (addressData) => {
      this.selectedAddress = this.duplicateAddress(addressData);
    });
  }

  public goToAddress() {
    this.navCtrl.push(AddressBookPage);
  }
  private duplicateAddress(object) {
    return new Address(object.id, object.img, object.alias, object.address);
  }

}
