import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Address } from '../../models/address';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-address',
  templateUrl: 'edit-address.html',
})
export class EditAddressPage {

  private address: Address;
  private action: string;
  private addressForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              public formBuilder: FormBuilder) {
    this.address = this.navParams.data;
    this.addressForm = formBuilder.group({
      address: [this.address.address, Validators.compose([Validators.minLength(26), Validators.required])],
      alias: [this.address.alias, Validators.compose([Validators.required])],
      id: [{value: this.address.id, disabled: true}],
      img: [this.address.img],
    });
  }

  private onSubmit(form) {
      form.value.id = this.navParams.data;
      this.event.publish('edited:address', form.value);
      this.navCtrl.pop();
  }
}
