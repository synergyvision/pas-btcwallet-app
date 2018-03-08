import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../app/models/address';
import { ErrorService } from '../../app/services/error.service';
import { SharedService } from '../../app/services/shared.service';
import { AppData } from '../../app/app.data';

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
  private error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              public formBuilder: FormBuilder, private sharedService: SharedService) {
    // Form Builder
    this.inputs = AppData.addressInputs;
    this.addressForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.addressForm.addControl(control.name, new FormControl(control.value));
      this.addressForm.controls[control.name].setValidators(control.validators);
    });
  }

  // Save changes to the address
  private onSubmit(form) {
    this.sharedService.addressExist(form.value.email)
    .subscribe((response) => {
      if (response) {
        this.validateAddress(form);
      } else {
        this.error = 'Este usuario no existe';
      }
    }, ((error: ErrorService) => {
      this.error = error.message;
    }));
  }

  private validateAddress(form: FormGroup) {
    this.sharedService.isAddressSaved(form.value.email)
      .subscribe((response) => {
        if (response.length === 0) {
          this.sharedService.addAddress(form);
          this.navCtrl.pop();
        } else {
          // User already exists on the addressBook
          this.error = 'Este usuario ya se encuentra en su libreta';
        }
      }, (error) => {
        this.error = error;
      });
  }
}
