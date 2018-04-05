import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedService } from '../../app/services/shared.service';
import { Wallet } from '../../app/models/wallet';
import { IPendingTxs, MultiSignedWallet } from '../../app/models/multisignedWallet';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})

export class WalletPage {

  private mSWallet: MultiSignedWallet;
  private wallet: Wallet;
  private pendingTx: Observable<IPendingTxs[]>;
  private error;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sharedService: SharedService) {
    this.getWallet();
  }

  public getWallet() {
    this.wallet = this.navParams.data;
    this.mSWallet = this.sharedService.getMultiSignedWallet(this.wallet.multiSignedKey);
    this.pendingTx = this.sharedService.getWalletPendingTx(this.mSWallet.key);
    console.log(this.mSWallet);
    console.log(this.wallet);
    console.log(this.pendingTx);
  }
}
