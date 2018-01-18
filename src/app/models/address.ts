import { IAddress } from './IAddress';

// Placeholder Class/Interface for the user registered addressess
// Used for Sending BTC or CC to an user that has a wallet

export class Address {
  public uid: number;
  public alias: string;
  public wallet?: string;
  public img?: string;

  constructor(id: number, alias: string, wallet?: string, img?: string) {
    this.uid = id;
    this.img = img;
    this.alias = alias;
    this.wallet = wallet;
  }

  public setWallet(wallet: string) {
    this.wallet = wallet;
  }

  public setAlias(alias: string) {
    this.alias = alias;
  }

  public getImg(avatar) {
    this.img = avatar;
  }
}
