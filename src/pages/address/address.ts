import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../app/models/address';

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})

// Component for displaying one address

export class AddressPage {

  private address: Address;
  private action: string;
  private addressForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              public formBuilder: FormBuilder) {
    // Form Builder
    this.addressForm = formBuilder.group({
      address: ['', Validators.compose([Validators.minLength(26), Validators.required])],
      alias: ['', Validators.compose([Validators.required])],
      id: [{value: null, disabled: true}],
      img: [{value: '../../assets/imgs/user.png'}],
    });
  }

  // Save changes to the address
  private onSubmit(form) {
    form.value.id = this.navParams.data;
    this.event.publish('added:address', form.value);
    this.navCtrl.pop();
  }
}
