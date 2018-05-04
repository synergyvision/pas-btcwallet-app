import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()

@Component({
  selector: 'page-show-mnemonics',
  templateUrl: 'show-mnemonics.html',
})
export class ShowMnemonicsPage {

  private mnnemonics: string;
  private words: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mnnemonics = this.navParams.data;
    this.words = (this.mnnemonics.split(' '));
  }

  private goBack() {
    if (this.navCtrl.getPrevious().name === 'CreateWalletPage') {
      this.navCtrl.setRoot('HomePage').then(() => {
        this.navCtrl.popToRoot();
      });
    } else  {
      this.navCtrl.pop();
    }
  }
}
