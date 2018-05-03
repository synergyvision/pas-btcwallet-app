import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Activity } from '../../app/models/activity';
import { AppData } from '../../app/app.data';
import { SharedService } from '../../app/services/shared.service';
import { IMSWalletRequest, IPendingTxs } from '../../app/models/multisignedWallet';
import { Observable } from 'rxjs/Observable';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { LoaderService } from '../../app/services/loader.service';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  private activityList: Observable<Activity[]>;
  private requestList: Observable<IMSWalletRequest[]>;
  private pendingTxList: Observable<IPendingTxs[]>;
  private error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sharedService: SharedService,
              private loaderService: LoaderService, private translate: TranslateService) {
    this.activityList = this.sharedService.getActivityList();
    this.activityList.subscribe((data) => {
      console.log(data);
    }); // AppData.activityList;
    this.requestList = this.sharedService.getRequests();
    this.pendingTxList = this.sharedService.pendingTxs;
  }

/*   private removeActivity(activity) {
    let index = this.activityList.indexOf(activity);
    if (index > -1) {
      this.activityList.splice(index, 1);
    }
  } */

  private acceptRequest(request: IMSWalletRequest) {
    this.loaderService.showFullLoader('LOADER.wait');
    this.sharedService.acceptMultiSignedWalletRequest(request);
    this.loaderService.dismissLoader();
  }

  private rejectRequest(request: IMSWalletRequest) {
    this.sharedService.rejectMultiSignedWalletRequest(request)
    .then(() => {
      this.requestList = this.sharedService.getRequests();
    });
  }

  private acceptPendingTx(pendingTx: IPendingTxs) {
    this.sharedService.acceptPendingTrx(pendingTx)
    .subscribe((transaction) => {
      this.navCtrl.push('TransactionConfirmationPage', transaction.tx);
    }, (error) => {
      console.log(error);
      this.error = this.translate.instant(error);
    });

  }

  private dismissPendingTx(pendingTx: IPendingTxs) {
    this.sharedService.dismissPendingTrx(pendingTx);
  }
}
