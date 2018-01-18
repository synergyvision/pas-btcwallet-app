import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../app/models/address';
import { AuthService } from '../../app/services/auth.service';

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
              public formBuilder: FormBuilder, private authService: AuthService) {
    // Form Builder
    this.addressForm = formBuilder.group({
      address: ['', Validators.compose([Validators.minLength(26), Validators.required])],
      alias: ['', Validators.compose([Validators.required])],
      id: [{value: null, disabled: true}],
      img: [{value: 'http://icons.iconarchive.com/icons/icons8/ios7/256/Users-User-Male-2-icon.png'}],
    });
  }

  // Save changes to the address
  private onSubmit(form) {
    //CHECK THIS
    form.value.id = this.navParams.data;
    this.event.publish('added:address', form.value);
    this.authService.addAddress(form);
    this.navCtrl.pop();
  }
}
