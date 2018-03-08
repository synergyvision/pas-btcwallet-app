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
import { LoaderService } from './services/loader.service';
import { ErrorService } from './services/error.service';
import { AlertService } from './services/alert.service';
import { CreateWalletPage } from '../pages/create-wallet/create-wallet';
import { EventService } from './services/events.services';
import { SharedService } from './services/shared.service';

@Component({
  providers: [RestService, AuthService, LoaderService, AlertService, AppSettings, EventService, SharedService],
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
              public restService: RestService, public authService: AuthService, public events: Events,
              public sharedService: SharedService) {
    this.initializeApp();

    // List of pages that appear on the Side Menu
    this.pages = AppSettings.pagesMenu;
    this.events.subscribe('user:loggedIn', () => {
      this.sharedService.updateUser();
      this.user = this.sharedService.user;
      this.rootPage = HomePage;
    });
    this.events.subscribe('user:newUser', () => {
      this.rootPage = CreateWalletPage;
    });
    this.events.subscribe('user:loggedOut', () => {
      this.rootPage = LoginPage;
    });
    this.events.subscribe('user:changedData', () => {
      this.user = this.sharedService.user;
    });
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.rootPage = LoginPage;
      this.splashScreen.hide();
    });
  }

  // Function for opening the Side Menu Pages
  public openPage(page) {
    if ((page.component !== this.rootPage) && (page.component !== this.nav.getActive().component)) {
      this.nav.push(page.component);
    }
    if (page.component === HomePage) {
      this.events.publish('home:refresh');
    }
  }

  // Log Out of the App
  public logOut() {
    this.authService.logout();
    this.events.publish('user:loggedOut');
  }
}
