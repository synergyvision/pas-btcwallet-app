// Placeholder Class/Interface for the user registered addressess
// Used for Sending BTC or CC

export class Address {
  public id: number;
  public img: string;
  public alias: string;
  public address: string;

  constructor(id: number, img: string, alias: string, address: string) {
    this.id = id;
    this.img = img;
    this.alias = alias;
    this.address = address;
  }

  public getId() {
    return this.id;
  }

  public getAddress() {
    return this.address;
  }

  public getAlias() {
    return this.alias;
  }

  public getImg() {
    return this.img;
  }
}
