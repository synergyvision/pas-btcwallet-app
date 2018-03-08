import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoaderService } from '../../app/services/loader.service';
import { IKeys } from '../../app/models/IKeys';
import { ConfirmEmailPage } from '../confirm-email/confirm-email';
import { Events } from 'ionic-angular/util/events';
import { AlertService } from '../../app/services/alert.service';
import { HomePage } from '../home/home';
import { AppData } from '../../app/app.data';
import { SharedService } from '../../app/services/shared.service';

@IonicPage()
@Component({
  selector: 'page-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletPage {

  private message: string;
  private crypto = AppData.cryptoCurrencies;
  private selectedCrypto;
  private mnemonics: string;
  private mnemonicsInfo;
  private passphrase;
  private passphraseInfo;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sharedService: SharedService,
              private loaderService: LoaderService, private viewCtrl: ViewController, private events: Events,
              private alertService: AlertService) {
    if (!this.navCtrl.parent === null) {
      this.navCtrl.swipeBackEnabled = false;
      this.viewCtrl.showBackButton(false);
      this.newUser();
    }
    this.message = 'Seleccione una Moneda';
    this.mnemonicsInfo = 'Debe guardar esta información, ya que le permitira recuperar su billetera' + 
                          'en caso de perder su contraseña.';
    this.passphraseInfo = 'Esta clave de seguridad se encargara de suministrar mayor seguridad a su billetera' +
                          ' debe guardar esta información, ya que es vital para poder recuperar sus datos ' +
                          ' en caso de perder su contraseña';
  }

  public newUser() {
    if (this.newUser) {
      this.alertService.showFullAlert('Bienvenido a Vision Wallet')
      .then(() => {
        this.alertService.showAlert('Necesitamos unos datos para continuar', 'Creación de una billetera')
      }).catch((error) => {
        this.events.publish('user:loggedOut');
      })
      .catch((error) => {
        this.events.publish('user:loggedOut');
      });
    }
  }

  public continue() {
    if (this.mnemonics === undefined) {
      this.loaderService.showFullLoader('Generando Datos');
      this.sharedService.createWallet(this.selectedCrypto, this.passphrase)
        .then((success) => {
          this.mnemonics = success.keys.mnemonics;
          this.loaderService.dismissLoader();
        });
    } else {
      this.navCtrl.setRoot(HomePage);
    }
  }

}
