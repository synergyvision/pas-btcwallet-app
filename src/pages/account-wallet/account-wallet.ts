import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { User } from '../../app/models/user';
import { AppSettings } from '../../app/app.settings';
import { AppData } from '../../app/app.data';
import { Wallet } from '../../app/models/wallet';
import { CryptoCoin } from '../../app/models/crypto';
import { SharedService } from '../../app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { LoaderService } from '../../app/services/loader.service';

@IonicPage()
@Component({
  selector: 'page-account-wallet',
  templateUrl: 'account-wallet.html',
})
export class AccountWalletPage {

  private wallets: Wallet[];
  private hdWallets: Wallet[];
  private user: User;
  private walletOptions = AppSettings.walletOptions;
  private cryptoUnitsList = AppData.cryptoUnitList;
  private currenciesList = AppData.currenciesList;
  private hdCryptoList = AppData.hdCryptoCurrencies;
  private selectedOption: string;
  private selectedWallet: Wallet;
  private selectedCrypto: CryptoCoin;
  private cryptoUnit: CryptoCoin;
  private selectedCurrency: string;
  private message: string;
  private showInput: boolean = false;
  private showWalletSelect: boolean = false;
  private showHDWalletSelect: boolean = false;
  private recoverWalletForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sharedService: SharedService,
              private translate: TranslateService, private formBuilder: FormBuilder,
              private loaderService: LoaderService) {
    this.wallets = this.sharedService.wallets;
    this.hdWallets = this.wallets.filter((w) => {
      return (w.address === '');
    });
    this.user = this.sharedService.user;
    this.cryptoUnit = this.cryptoUnitsList.pop();
    this.recoverWalletForm = formBuilder.group({
      mnemonics: ['Mnemonics', Validators.compose([Validators.required, Validators.minLength(30), 
                this.validateMnemonics])],
      crypto: [null, Validators.required],
      passphrase: [null],
    });
  }

  // Dinamically handles the functions returned from AppData

  get self() { return this; }

  // Clears previous data from the view

  private clearData() {
    this.selectedOption = this.selectedCrypto =
    this.selectedWallet = this.selectedCurrency =
    this.message = this.selectedWallet = undefined;
    this.showWalletSelect = this.showHDWalletSelect = this.showInput = false;
  }

  private ionViewWillEnter() {
    this.clearData();
  }

  // Once an option is selected, we manage what kind of response we are going to show to the user

  private selectOption(value) {
    this.clearData();
    this.selectedOption = value;
    if (this.selectedOption.match(/^(changeCryptoUnit)$/)) {
      console.log('here');
      this.showWalletSelect = true;
    }
    if (this.selectedOption.match(/^(exportWallet)$/)) {
      this.showHDWalletSelect = true;
      console.log('here');
    }
    if (this.selectedOption.match(/^(importWallet)$/)) {
      this.showInput = true;
    }
  }

  // Function for changing the cryptocurrency unit

  private changeCryptoUnit() {
    this.loaderService.showLoader('LOADER.wait');
    this.selectedWallet.crypto.units = this.selectedCrypto;
    this.sharedService.updateWalletCryptoUnit(this.selectedWallet)
    .then((success) => {
      this.clearData();
      this.message = this.translate.instant('ACCOUNT_OPTIONS.success');
      this.loaderService.dismissLoader();
    })
    .catch((error) => {
      this.message = this.translate.instant('ERROR.unknown');
      this.loaderService.dismissLoader();
    });
  }

  private changeCurrency() {
    this.loaderService.showLoader('LOADER.wait');
    this.sharedService.updateCurrency(this.selectedCurrency)
    .then(() => {
      this.clearData();
      this.message = this.translate.instant('ACCOUNT_OPTIONS.success');
      this.loaderService.dismissLoader();
    })
    .catch((error) => {
      this.message = this.translate.instant('ERROR.unknown');
      this.loaderService.dismissLoader();
    });
  }

  // Function that shows the Mnemonics of an HD Wallet

  private exportWallet() {
    this.loaderService.showLoader('LOADER.retrieving_data');
    this.sharedService.getWalletMnemonics(this.selectedWallet)
    .subscribe((mnemonics) => {
      this.selectedWallet = undefined;
      if (mnemonics !== undefined) {
        this.navCtrl.push('ShowMnemonicsPage', mnemonics);
      } else {
        this.message = this.translate.instant('ERROR.no_mnemonics');
      }
      this.loaderService.dismissLoader();
    }, (error) => {
      this.message = this.translate.instant('ERROR.unknown');
      this.loaderService.dismissLoader();

    });
  }

  private importWallet(form: FormGroup) {
    this.loaderService.showLoader('LOADER.creating_data');
    this.sharedService.importWalletMnemonics(form.value.mnemonics, form.value.crypto,
    form.value.passphrase)
    .then((response) => {
      this.loaderService.dismissLoader();
      this.message = this.translate.instant('WALLET_SETTINGS.wallet_imported');
    })
    .catch((error) => {
      this.loaderService.dismissLoader();
      this.message = this.translate.instant('ERROR.unknown');
    });
  }

  private validateMnemonics(mnemonics: FormControl): ValidationErrors {
    if (mnemonics.value !== null) {
      const g = mnemonics.value.match(new RegExp('[a-zA-Z]+[^\/|\-|\*|\+]', 'g'));
      if ( g !== null ) {
        if (g.length > 11) {
          return null;
        }
      }
    }
    return {length: false};
  }

  private onWalletChange() {
    if (this.selectedOption === 'changeCryptoUnit') {
      this.cryptoUnit = this.cryptoUnitsList
      .filter((crypto) => {
        return (crypto.value === this.selectedWallet.crypto.value);
      }).pop();
    } else if (this.selectedOption === 'exportWallet') {
      this.exportWallet();
    }
  }
}
