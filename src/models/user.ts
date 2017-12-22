import { IAddress } from './IAddress';
import { IWallet } from './IWallet';

// Placeholder Class/Interface for the data of the logged user

export class User {
  public name: string;
  public email: string;
  public wallet: IWallet;
  public code: string;

  constructor(name, email, code, wallet?) {
    this.name = name;
    this.email = email;
    this.code = code;
    this.wallet = wallet;
  }

  public setWallet(wallet: IWallet) {
    this.wallet = wallet;
  }
}
