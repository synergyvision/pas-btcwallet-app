import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedService } from '../../app/services/shared.service';
import { AppData } from '../../app/app.data';
import { LoaderService } from '../../app/services/loader.service';
import { AlertService } from '../../app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-create-multiwallet',
  templateUrl: 'create-multiwallet.html',
})
export class CreateMultiwalletPage {

  private crypto = AppData.multiCryptoCurrencies;
  private signers = AppData.numberOfSigners;
  private signatures = this.signers;
  private numberOfSigners: number;
  private numberOfSignatures: number;
  private selectedCrypto;
  private error: string;
  private users: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sharedService: SharedService,
              private loaderService: LoaderService, public alertService: AlertService,
              public translate: TranslateService) {
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
        this.loaderService.showLoader('LOADER.wait');
        this.sharedService.createMultisignWalletRequest(form, this.users.slice(0))
        .subscribe((d) => {
          this.loaderService.dismissLoader();
          this.alertService.showAlert('ALERT.request_created', 'ALERT.success')
          .then(() => {
            this.navCtrl.popToRoot();
          });
        },
        (error) => {
          console.log(error);
          this.error = this.translate.instant(error);
        });
      } else {
        this.error =  this.translate.instant('ERROR.request_user_error');
      }
    }, (error) => {
      console.log(error);
    });
  }
}
