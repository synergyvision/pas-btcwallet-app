import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Activity } from '../../app/models/activity';
import { AppData } from '../../app/app.data';
import { SharedService } from '../../app/services/shared.service';
import { IMSWalletRequest } from '../../app/models/multisignedWallet';

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  private activityList: Activity[];
  private requestList: IMSWalletRequest[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sharedService: SharedService) {
    this.activityList = AppData.activityList;
    this.requestList = this.sharedService.requestList;
  }

  private removeActivity(activity) {
    let index = this.activityList.indexOf(activity);
    if (index > -1) {
      this.activityList.splice(index, 1);
    }
  }

  private acceptRequest(request: IMSWalletRequest) {
    this.sharedService.acceptMultiSignedWalletRequest(request);
  }
}
