import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Slides } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { QRScanner } from '@ionic-native/qr-scanner';
import { NgPipesModule } from 'ngx-pipes';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// i18n Imports
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase And Services
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { AlertService } from './services/alert.service';
import { LoaderService } from './services/loader.service';
import { KeyService } from './services/key.service';
import { AuthService } from './services/auth.service';
import { EventService } from './services/events.services';
import { ExchangeService } from './services/exchange.service';
import { SharedService } from './services/shared.service';
import { RestService } from './services/rest.service';
import { StorageProvider } from '../providers/firebase/storage';
import { Camera } from '@ionic-native/camera';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const firebaseConfig = {
  apiKey: 'AIzaSyBTBCJbNBmUBmKaMUK-JMFTKgY1W8H-r6w',
  authDomain: 'visionbitwallet.firebaseapp.com',
  databaseURL: 'https://visionbitwallet.firebaseio.com',
  projectId: 'visionbitwallet',
  storageBucket: 'visionbitwallet.appspot.com',
  messagingSenderId: '1069944614319',
};

@NgModule({
  bootstrap: [IonicApp],
  declarations: [
    MyApp,
  ],
  entryComponents: [
    MyApp,
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    NgPipesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    Camera,
    FirebaseProvider,
    StorageProvider,
    AlertService,
    LoaderService,
    KeyService,
    AuthService,
    ExchangeService,
    EventService,
    QRScanner,
    SplashScreen,
    SharedService,
    RestService,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler,
    },
    StatusBar,
  ],
})
export class AppModule { }
