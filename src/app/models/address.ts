import { IAddress } from './IAddress';

// Placeholder Class/Interface for the user registered addressess
// Used for Sending BTC or CC to an user that has a wallet

export class Address {
  public alias: string;
  public email: string;
  public img?: string;
  public uid?: string;

  constructor(alias: string, email: string, img?: string, uid?: string) {
    this.img = img;
    this.alias = alias;
    this.email = email;
    this.uid= uid;
  }

  public setAlias(alias: string) {
    this.alias = alias;
  }

  public getImg(avatar) {
    this.img = avatar;
  }
}
