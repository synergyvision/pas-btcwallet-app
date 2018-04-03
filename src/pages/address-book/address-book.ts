import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Observable } from 'rxjs';
import { SharedService } from '../../app/services/shared.service';

@IonicPage()
@Component({
  selector: 'page-address-book',
  templateUrl: 'address-book.html',
})

// Component that displays all of the registered user´s addresses

export class AddressBookPage {

  public addressBook: Observable<any>;
  public uid;
  private selectAddress: boolean;
  private zone: NgZone;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              public dataProvider: FirebaseProvider, public sharedService: SharedService) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.uid = this.sharedService.user.uid;
    this.addressBook = dataProvider.getAddressBook(this.uid);
    // If this view parent is SendPage, then we select an Address for sending BTC or CC
    if (this.navCtrl.last().name === 'SendPage') {
      this.selectAddress = true;
    }
  }

  // Pushes a new Address to the Address List
  private addAddress() {
    this.navCtrl.push('AddressPage');
  }

  // Opens AddressPage or selects an Address for SendPage
  private editAddress(address) {
    // Sends the selected Address to SendPage (the parent)
    if (this.selectAddress) {
      this.event.publish('selected:address', address);
      this.navCtrl.pop();
      // Else, opens EditAddressPage with a selected Address to be seen or modified
    } else {
      this.navCtrl.push('EditAddressPage', address);
    }
  }

  // Deletes an Address from the Address List
  private removeAddress(address) {
    this.dataProvider.removeAddressFromAddressBook(this.uid, address);
  }
}
