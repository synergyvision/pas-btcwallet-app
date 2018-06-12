import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestService } from './services/rest.service';
import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { Events } from 'ionic-angular/util/events';
import { AppSettings } from './app.settings';
import { LoaderService } from './services/loader.service';
import { AlertService } from './services/alert.service';
import { EventService } from './services/events.services';
import { SharedService } from './services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageProvider } from '../providers/firebase/storage';
import { TwoFactorAuthService } from './services/twofactorauth.service';
import { ActivityService } from './services/activity.service';

@Component({
  providers: [RestService, AuthService, LoaderService, AlertService, AppSettings, ActivityService,
              EventService, SharedService, StorageProvider, TwoFactorAuthService],
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
              public sharedService: SharedService, public translate: TranslateService) {
    this.initializeApp();
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');
    const browserLang = this.translate.getBrowserLang();
    // this.translate.use(browserLang);

    // Handle Back Button on Android Devices
    platform.registerBackButtonAction(() => {
      const activeView: ViewController = this.nav.getActive();
      if (activeView != null) {
        if (typeof activeView.instance.backButtonAction === 'function') {
          activeView.instance.backButtonAction();
        } else if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          this.nav.parent.select(0); // goes to the first tab
        }
      }
    });

    // List of pages that appear on the Side Menu
    this.pages = AppSettings.pagesMenu;
    this.events.subscribe('user:loggedIn', () => {
      this.sharedService.updateUser();
      this.user = this.sharedService.user;
      this.nav.setRoot('HomePage');
      this.nav.popToRoot();
      // Function for showing the notification symbol on Activity
      this.sharedService.showNotification();
    });
    this.events.subscribe('user:newUser', () => {
      this.rootPage = 'CreateWalletPage';
    });
    this.events.subscribe('user:loggedOut', () => {
      this.nav.setRoot('LoginPage');
      this.nav.popToRoot();
    });
    this.events.subscribe('user:changedData', () => {
      this.user = this.sharedService.user;
    });
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.rootPage = 'LoginPage';
      this.splashScreen.hide();
    });

  }

  // Function for opening the Side Menu Pages
  public openPage(page) {
    if ((page.component !== this.rootPage) && (page.component !== this.nav.getActive().component)) {
      this.nav.push(page.component);
    }
    if (page.component === 'HomePage') {
      this.events.publish('home:refresh');
    }
  }

  // Log Out of the App
  public logOut() {
    this.events.publish('user:loggedOut');
  }
}
