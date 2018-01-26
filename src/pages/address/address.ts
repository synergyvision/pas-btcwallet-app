import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Address } from '../../app/models/address';
import { AuthService } from '../../app/services/auth.service';
import { AppSettings } from '../../app/app.settings';

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
  private inputs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              public formBuilder: FormBuilder, private authService: AuthService) {
    // Form Builder
    this.inputs = [
      {
        placeholder: 'Correo Electrónico', name: 'email', value: '', type: 'email',
        validators: [Validators.email, Validators.maxLength(30), Validators.required],
      },
      {
        placeholder: 'Alias', name: 'alias', value: '', type: 'text',
        validators: [Validators.required, Validators.maxLength(30)],
      },
      {
        placeholder: '', name: 'id', value: null, type: 'null',
        validators: null,
      },
      {
        placeholder: '', name: 'img', value: '../assets/icons/wallet-user.svg', type: 'null',
        validators: null,
      },
    ];
    this.addressForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.addressForm.addControl(control.name, new FormControl(control.value));
      this.addressForm.controls[control.name].setValidators(control.validators);
    });
  }

  // Save changes to the address
  private onSubmit(form) {
    this.authService.addAddress(form);
    console.log(form);
    this.navCtrl.pop();
  }
}
