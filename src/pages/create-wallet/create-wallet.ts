import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoaderService } from '../../app/services/loader.service';
import { IKeys } from '../../app/models/IKeys';
import { Events } from 'ionic-angular/util/events';
import { AlertService } from '../../app/services/alert.service';
import { AppData } from '../../app/app.data';
import { SharedService } from '../../app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletPage {

  private message: string;
  private crypto = AppData.cryptoCurrencies;
  private selectedCrypto;
  private passphrase;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sharedService: SharedService,
              private loaderService: LoaderService, private viewCtrl: ViewController, private events: Events,
              private alertService: AlertService, private translateService: TranslateService) {
    if (!this.navCtrl.parent === null) {
      this.navCtrl.swipeBackEnabled = false;
      this.viewCtrl.showBackButton(false);
      this.newUser();
    }
  }

  public newUser() {
    if (this.newUser) {
      this.alertService.showFullAlert('CREATE_WALLET.welcome_message')
      .then(() => {
        this.alertService.showAlert('CREATE_WALLET.new_user_message', 'CREATE.WALLET.new_user_title');
      }).catch((error) => {
        this.events.publish('user:loggedOut');
      })
      .catch((error) => {
        this.events.publish('user:loggedOut');
      });
    }
  }

  public continue() {
    this.loaderService.showFullLoader('LOADER.creating_data');
    this.sharedService.createWallet(this.selectedCrypto, this.passphrase)
      .then((success) => {
        this.loaderService.dismissLoader();
        this.navCtrl.push('ShowMnemonicsPage', success.keys.mnemonics);
      })
      .catch((error) => {
        this.translateService.instant(error);
        this.loaderService.dismissLoader();
      });
    }
}
