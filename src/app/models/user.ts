
// Placeholder Class/Interface for the data of the logged user
// Using the firebase.User Interface
// More info on https://firebase.google.com/docs/reference/js/firebase.User

export class User {
  public uid: string;
  public email: string;
  public emailVerified: boolean;
  public phoneNumber?: number;
  public photoURL?: string;

  constructor(uid, email, emailVerified,  phone?, photoURL?) {
    this.uid = uid,
    this.email = email;
    this.emailVerified = emailVerified;
    this.phoneNumber = phone;
    if ( photoURL) {
    this.photoURL = photoURL;
    } else {
      this.photoURL = 'http://icons.iconarchive.com/icons/icons8/ios7/256/Users-User-Male-2-icon.png';
    }
  }

  public setPhone(phone: number) {
    this.phoneNumber = phone;
  }

  public setPhotoURL(photo: string) {
    this.photoURL = photo;
  }
}
