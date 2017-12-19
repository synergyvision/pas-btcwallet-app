import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public username: string;
  public avatar: string;
  public correo: string;
  public pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.avatar = '/imgs/user.png';
    this.username = 'Usuario';
    this.correo = 'usuario@correo';
    this.pages = [
      // { title: 'Usuario', component: HomePage },
      // { title: 'Contraseña', component: ListPage },
    ];
  }
}
