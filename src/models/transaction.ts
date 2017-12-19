// Placeholder Class/Interface for the log of the user's transactions
// Related to Receveing and Sending BTC or CC

export class Transaction {
    public id: number;
    public date: string;
    public address: string;
    public amount: number;
    public fee: number;

    constructor(id: number, date: string, address: string, amount: number, fee: number) {
      this.id = id;
      this.date = date;
      this.address = address;
      this.amount = amount;
      this.fee = fee;
    }
}
