// Placeholder Class/Interface for the log of the user's transactions
// Related to Receveing and Sending BTC or CC

export class Transaction {
    public id: number;
    public date: string;
    public alias?: string;
    public address: string;
    public amount: number;

    constructor(id: number, date: string, amount: number, address: string, alias?: string) {
      this.id = id;
      this.date = date;
      this.address = address;
      this.alias = alias;
      this.amount = amount;
    }
}
