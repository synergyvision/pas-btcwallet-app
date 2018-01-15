import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { AuthService } from '../../app/services/auth.service';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public user: User;
  public pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService) {
    this.user = this.authService.getLoggedUser();
    this.pages = [
      // { title: 'Usuario', component: HomePage },
      // { title: 'Contraseña', component: ListPage },
    ];
  }
}
