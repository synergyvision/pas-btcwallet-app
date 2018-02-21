import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../app/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../app/models/user';
import { AppSettings } from '../../app/app.settings';
import { AppData } from '../../app/app.data';
import { Wallet } from '../../app/models/wallet';
import { CryptoCoin } from '../../app/models/crypto';

@IonicPage()
@Component({
  selector: 'page-account-wallet',
  templateUrl: 'account-wallet.html',
})
export class AccountWalletPage {

  private wallets: Wallet[];
  private user: User;
  private walletOptions = AppSettings.walletOptions;
  private cryptoUnitsList = AppData.cryptoUnitList;
  private currenciesList = AppData.currenciesList;
  private selectedOption: string;
  private selectedWallet: Wallet;
  private selectedCrypto: CryptoCoin;
  private cryptoUnit: CryptoCoin;
  private selectedCurrency: string;
  private message: string;
  private wif: string;
  private showWalletSelect: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService) {
    this.wallets = this.authService.wallets;
    this.user = this.authService.user;
    this.cryptoUnit = this.cryptoUnitsList.pop();
  }

  get self() { return this; }
  private changeCurrency() {
    // this.authService.changeCurrency(this.selectedCurrency);
    this.clearData();
    this.message = 'Cambio exitoso';
  }

  private selectOption(value) {
    this.clearData();
    this.selectedOption = value;
    if (this.selectedOption.match(/^(exportWallet|changeCryptoUnit|showMnemonics)$/)) {
        this.showWalletSelect = true;
    } else {
      this.showWalletSelect = false;
    }
  }

  private changeCryptoUnit() {
    this.selectedWallet.crypto.units = this.selectedCrypto;
    this.authService.updateWalletCryptoUnit(this.selectedWallet)
    .then((success) => {
      this.clearData();
      this.message = 'Cambio exitoso';
    })
    .catch((error) => {
      this.message = 'Ocurrio un error, intente mas tarde';
    });
  }

  private clearData() {
    this.selectedOption = this.selectedCrypto =
    this.selectedWallet = this.selectedCurrency =
    this.wif = this.message = undefined;
    this.showWalletSelect = false;
  }

  private exportWallet() {
    this.authService.getWalletWIF(this.selectedWallet)
    .subscribe((wif) => {
      this.wif = wif;
    });
  }

  private showMnemonics() {
    this.authService.getWalletMnemonics(this.selectedWallet)
    .subscribe((mnemonics) => {
      this.selectedWallet.keys.mnemonics = mnemonics;
    });
  }

  private onWalletChange() {
    if (this.selectedOption === 'changeCryptoUnit') {
      this.cryptoUnit = this.cryptoUnitsList
      .filter((crypto) => {
        return (crypto.value === this.selectedWallet.crypto.value);
      }).pop();
    } else if (this.selectedOption === 'exportWallet') {
      this.exportWallet();
    } else {
      this.showMnemonics();
    }
  }
}
