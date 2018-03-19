import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Activity } from '../../app/models/activity';
import { AppData } from '../../app/app.data';
import { SharedService } from '../../app/services/shared.service';
import { IMSWalletRequest } from '../../app/models/multisignedWallet';
import { Observable } from 'rxjs/Observable';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { LoaderService } from '../../app/services/loader.service';

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  private activityList: Activity[];
  private requestList: Observable<IMSWalletRequest[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sharedService: SharedService,
              private loaderService: LoaderService) {
    this.activityList = AppData.activityList;
    this.requestList = this.sharedService.getRequests();
  }

  private removeActivity(activity) {
    let index = this.activityList.indexOf(activity);
    if (index > -1) {
      this.activityList.splice(index, 1);
    }
  }

  private acceptRequest(request: IMSWalletRequest) {
    this.loaderService.showFullLoader('Espere');
    this.sharedService.acceptMultiSignedWalletRequest(request);
    this.loaderService.dismissLoader();
  }

  private rejectRequest(request: IMSWalletRequest) {
    this.sharedService.rejectMultiSignedWalletRequest(request)
    .then(() => {
      this.requestList = this.sharedService.getRequests();
    });
  }
}
