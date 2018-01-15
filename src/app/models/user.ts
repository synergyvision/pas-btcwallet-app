import { IAddress } from './IAddress';
import { IWallet } from './IWallet';

// Placeholder Class/Interface for the data of the logged user

export class User {
  public uid: string;
  public email: string;
  public wallet: IWallet;
  public phone?: number;
  public emailVerified: boolean;


  constructor(uid, email, emailVerified, wallet?, phone? ) {
    this.uid = uid,
    this.email = email;
    this.emailVerified = emailVerified;
    this.wallet = wallet;
    this.phone = phone;
  }

  public setWallet(wallet: IWallet) {
    this.wallet = wallet;
  }

  public setPhone(phone: number) {
    this.phone = phone;
  }
}
