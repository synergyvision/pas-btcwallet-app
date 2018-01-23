import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../app/models/address';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { AuthService } from '../../app/services/auth.service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
              public formBuilder: FormBuilder, public dataProvider: FirebaseProvider, public authService: AuthService) {
    this.key = this.navParams.get('key');
    this.address = this.navParams.data;
    this.addressForm = formBuilder.group({
      email: ['', Validators.compose([
        Validators.email,
        Validators.maxLength(30),
        Validators.required])],
      alias: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
      ])],
      img: [{ value: 'http://icons.iconarchive.com/icons/icons8/ios7/256/Users-User-Male-2-icon.png' }],
    });
    this.uid = this.authService.user.uid;
  }

  private onSubmit(form) {
    this.dataProvider.editAddressFromAddressBook(this.uid, this.key, form.value);
    this.navCtrl.pop();
  }
}
