
// Placeholder Class/Interface for the data of the logged user
// Using the firebase.User Interface
// More info on https://firebase.google.com/docs/reference/js/firebase.User

export interface IToken {
  activated?: boolean;
  enabled?: boolean;
}
export class User {
  public uid: string;
  public email: string;
  public emailVerified: boolean;
  public phoneNumber?: number;
  public photoURL?: string;
  public displayName?: string;
  public token?: IToken;

  constructor(uid, email, emailVerified, phone?, photoURL?, name?, token?) {
    this.uid = uid,
    this.email = email;
    this.emailVerified = emailVerified;
    this.phoneNumber = phone;
    this.displayName = name || email;
    if ( photoURL) {
    this.photoURL = photoURL;
    } else {
      this.photoURL = 'http://icons.iconarchive.com/icons/icons8/ios7/256/Users-User-Male-2-icon.png';
    }
    this.token = token || this.createToken();
  }

  public setPhone(phone: number) {
    this.phoneNumber = phone;
  }

  public createToken(): IToken {
    const token: IToken = {};
    token.enabled = false;
    token.activated = false;
    return token;
  }

  public setPhotoURL(photo: string) {
    this.photoURL = photo;
  }
}
