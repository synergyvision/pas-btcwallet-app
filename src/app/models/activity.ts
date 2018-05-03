// Placeholder Class for the log of user activity
// Related to LogIns and new Devices

export class Activity {
    public key?: string;
    public date: string;
    public name?: string;
    public description?: any;

    constructor(date: string, name: any, description?, key?: string) {
      this.date = date;
      this.name = name;
      this.description = description || '';
    }

    public setActivity(activity) {
      this.name = activity;
    }
}
