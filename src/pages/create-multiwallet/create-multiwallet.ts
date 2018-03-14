import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedService } from '../../app/services/shared.service';
import { AppData } from '../../app/app.data';
import { LoaderService } from '../../app/services/loader.service';

@IonicPage()
@Component({
  selector: 'page-create-multiwallet',
  templateUrl: 'create-multiwallet.html',
})
export class CreateMultiwalletPage {

  private crypto = AppData.cryptoCurrencies;
  private signers = AppData.numberOfSigners;
  private signatures = this.signers;
  private numberOfSigners: number;
  private numberOfSignatures: number;
  private selectedCrypto;
  private error: string;
  private users: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sharedService: SharedService,
              private loaderService: LoaderService) {
  }

  private onSignersChange() {
    this.signatures = this.signers.slice(0, this.numberOfSigners - 1);
    this.users.length = this.numberOfSigners - 1;
  }

  private trackByIndex(index: number, obj: any): any {
    return index;
  }

  private continue(form) {
    this.sharedService.addressesExist(this.users)
    .subscribe((data) => {
      if (data) {
        this.sharedService.createMultisignWalletRequest(form, this.users.slice(0));
      } else {
        this.error = 'Error, uno o más de los usuarios no se encuentra registrado';
      }
    }, (error) => {
      console.log(error);
    });    /*   .subscribe((response) => {
        if (response) {
          console.log(response;
        } else {
          this.error = 'Este usuario no existe';
        }
      }, ((error: ErrorService) => {
        this.error = error.message;
      })); */
  }
}
