import { IAddress } from './IAddress';
import { IWallet } from './IWallet';

// Placeholder Class/Interface for the data of the logged user

export class User {
  public name: string;
  public email: string;
  public wallet: IWallet;
  // Placeholder for the FrontEnd
  public code: string;
  public avatar: string;

  constructor(name, email, code, wallet?, avatar?) {
    this.name = name;
    this.email = email;
    this.code = code;
    this.wallet = wallet;
    this.avatar = avatar;
  }

  public setWallet(wallet: IWallet) {
    this.wallet = wallet;
  }
}
