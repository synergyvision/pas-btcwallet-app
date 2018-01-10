import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { SendPage } from '../send/send';
import { EditAddressPage } from '../edit-address/edit-address';
import { NgZone } from '@angular/core';
import { RestService } from '../../app/services/rest.service';

@IonicPage()
@Component({
  selector: 'page-address-book',
  templateUrl: 'address-book.html',
})

// Component that displays all of the registered user´s addresses

export class AddressBookPage {

  private selectAddress: boolean;
  private zone: NgZone;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              private restService: RestService) {

    // Listener for event for updating the list
    // Comes from AddressPage, and the data is the new Address data
    this.zone = new NgZone({ enableLongStackTrace: false });

    this.event.subscribe('added:address', (addressData) => {
      this.restService.addressBook.push(addressData);
    });

    this.event.subscribe('edited:address', (addressData) => {
      // Not updating currently because of model
      this.restService.addressBook[addressData.id] = addressData;
      console.log(this.restService.addressBook);
    });

    // If this view parent is SendPage, then we select an Address for sending BTC or CC
    if (this.navCtrl.last().name === 'SendPage') {
      this.selectAddress = true;
    }
  }

  // Pushes a new Address to the Address List
  private addAddress() {
    let id = this.restService.addressBook.length + 1;
    this.navCtrl.push(AddressPage, id);
  }

  // Opens AddressPage or selects an Address for SendPage
  private editAddress(address) {
    // Sends the selected Address to SendPage (the parent)
    if (this.selectAddress) {
      this.event.publish('selected:address', address);
      this.navCtrl.pop();
    // Else, opens EditAddressPage with a selected Address to be seen or modified
    } else {
      this.navCtrl.push(EditAddressPage, address);
    }
  }

  // Deletes an Address from the Address List
  private removeAddress(address) {
    let index = this.restService.addressBook.indexOf(address);
    if (index > -1) {
      this.restService.addressBook.splice(index, 1);
    }
  }
}
