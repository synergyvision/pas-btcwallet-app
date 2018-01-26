import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RestService } from './services/rest.service';
import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { Events } from 'ionic-angular/util/events';
import { AppSettings } from './app.settings';

@Component({
  providers: [RestService, AuthService, AppSettings],
  templateUrl: 'app.html',
})

export class MyApp {
  @ViewChild(Nav)

  public nav: Nav;
  public rootPage: any;
  public pages: Array<{
    title: string,
    component: any,
  }>;
  public user: User;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public restService: RestService, public authService: AuthService, public events: Events) {
    this.initializeApp();

    // List of pages that appear on the Side Menu
    this.pages = AppSettings.pagesMenu;
    this.events.subscribe('user:loggedIn', (user) => {
      this.user = user;
    });
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // User not logged in
      console.log(this.user);
      if (!this.user) {
        this.rootPage = LoginPage;
      } else {
        this.rootPage = HomePage;
      }
      this.splashScreen.hide();
    });
  }

  // Function for opening the Side Menu Pages
  public openPage(page) {
    if ((page.component !== this.rootPage) && (page.component !== this.nav.getActive().component)) {
      this.nav.push(page.component);
    }
  }

  // Log Out of the App
  public logOut() {
    this.authService.logout();
    this.nav.setRoot(LoginPage);
  }
}
