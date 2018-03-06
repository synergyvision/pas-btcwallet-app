import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Activity } from '../../app/models/activity';
import { RestService } from '../../app/services/rest.service';
import { AppData } from '../../app/app.data';

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  private activityList: Activity[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService) {
    this.activityList = AppData.activityList;
  }

  private removeActivity(activity) {
    let index = this.activityList.indexOf(activity);
    if (index > -1) {
      this.activityList.splice(index, 1);
    }
  }
}
