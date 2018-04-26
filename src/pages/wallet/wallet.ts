import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedService } from '../../app/services/shared.service';
import { Wallet } from '../../app/models/wallet';
import { IPendingTxs, MultiSignedWallet, ISigner } from '../../app/models/multisignedWallet';
import { Observable } from 'rxjs';
import { Address } from '../../app/models/address';

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})

export class WalletPage {

  private mSWallet: MultiSignedWallet;
  private wallet: Wallet;
  private pendingTx: Observable<IPendingTxs[]>;
  private users: Observable<Address[]>;
  private error;
  private showPendingTx: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sharedService: SharedService) {
    this.getWallet();
  }

  public getWallet() {
    this.wallet = this.navParams.data;
    this.mSWallet = this.sharedService.getMultiSignedWallet(this.wallet.multiSignedKey);
    this.pendingTx = this.sharedService.getWalletPendingTx(this.mSWallet.key);
    this.pendingTx.subscribe((data) => {
      if (data.length > 0) {
        console.log(data);
        this.showPendingTx = true;
      }
    });
    this.getSigners(this.mSWallet.signers);
  }

  public getSigners(signers: ISigner[]) {
    this.users = this.sharedService.getWalletSigners(signers);
    console.log(this.users.subscribe((data) => {console.log(data); }));

  }
}
