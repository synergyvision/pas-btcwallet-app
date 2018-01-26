import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Address } from '../../app/models/address';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { AuthService } from '../../app/services/auth.service';
import { AppSettings } from '../../app/app.settings';

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
  private inputs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              public formBuilder: FormBuilder, public dataProvider: FirebaseProvider, public authService: AuthService) {
    this.key = this.navParams.get('key');
    this.address = this.navParams.data;
    this.inputs = [
      {
        placeholder: 'Correo', name: 'email', value: this.address.email, type: 'email',
        validators: [Validators.email, Validators.maxLength(30), Validators.required],
      },
      {
        placeholder: 'Alias', name: 'alias', value: this.address.alias, type: 'text',
        validators: [Validators.required, Validators.maxLength(30)],
      },
      {
        placeholder: '', name: 'key', value: this.key, type: '',
        validators: [],
      },
      {
        placeholder: '', name: 'img', value: this.address.img, type: '',
        validators: [],
      },
    ];
    this.addressForm = formBuilder.group({});
    this.inputs.forEach((control) => {
      this.addressForm.addControl(control.name, new FormControl(control.value));
      this.addressForm.controls[control.name].setValidators(control.validators);
    });
    this.uid = this.authService.user.uid;
  }

  private onSubmit(form) {
    this.dataProvider.editAddressFromAddressBook(this.uid, this.key, form.value);
    this.navCtrl.pop();
  }

  private goBack() {
    this.navCtrl.pop();
  }
}
