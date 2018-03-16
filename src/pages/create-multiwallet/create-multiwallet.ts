import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedService } from '../../app/services/shared.service';
import { AppData } from '../../app/app.data';
import { LoaderService } from '../../app/services/loader.service';
import { AlertService } from '../../app/services/alert.service';

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
              private loaderService: LoaderService, public alertService: AlertService) {
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
        this.loaderService.showLoader('Espere');
        this.sharedService.createMultisignWalletRequest(form, this.users.slice(0))
        .subscribe((d) => {
          this.loaderService.dismissLoader();
          this.alertService.showAlert('Solicitud Creada', 'Éxito')
          .then(() => {
            this.navCtrl.popToRoot();
          });
        },
        (error) => {
          this.error = error;
        });
      } else {
        this.error = 'Error, uno o más de los usuarios no se encuentra registrado';
      }
    }, (error) => {
      console.log(error);
    });
  }
}
