// Placeholder Class for the log of user activity
// Related to LogIns and new Devices

export class Activity {
    public key?: string;
    public date: string;
    public activity?: any;

    constructor(date: string, activity?: any, key?: string) {
      this.key = key;
      this.date = date;
      this.activity = activity;
    }

    public setActivity(activity) {
      this.activity = activity;
    }
}
