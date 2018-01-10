// Placeholder Class/Interface for the log of user activity
// Related to LogIns and new Devices

export class Activity {
    public id: number;
    public date: string;
    public description: string;

    constructor(id: number, date: string, description: string) {
      this.id = id;
      this.date = date;
      this.description = description;
    }
}
