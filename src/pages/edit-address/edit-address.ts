import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../app/models/address';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { AppSettings } from '../../app/app.settings';
import { SharedService } from '../../app/services/shared.service';
import { AppData } from '../../app/app.data';

@IonicPage()
@Component({
  selector: 'page-edit-address',
  templateUrl: 'edit-address.html',
})
export class EditAddressPage {

  private address: Address;
  private action: string;
  private addressForm: FormGroup;
  private key: string;
  private uid: string;
  private inputs = AppData.addressInputs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sharedService: SharedService,
              public formBuilder: FormBuilder, public dataProvider: FirebaseProvider, public event: Events ) {
    this.key = this.navParams.get('key');
    this.address = this.navParams.data;
    this.addressForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.addressForm.addControl(control.name, new FormControl(control.value));
      this.addressForm.controls[control.name].setValidators(control.validators);
    });
    this.uid = this.sharedService.user.uid;
  }

  private onSubmit(form) {
    this.dataProvider.editAddressFromAddressBook(this.uid, this.key, form.value);
    this.navCtrl.pop();
  }

  private goBack() {
    this.navCtrl.pop();
  }
}
