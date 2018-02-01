import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { QRScanner } from '@ionic-native/qr-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// i18n Imports
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Firebase

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from '../providers/firebase/firebase';

// Page List
import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ReceivePage } from '../pages/receive/receive';
import { SendPage } from '../pages/send/send';
import { AddressBookPage } from '../pages/address-book/address-book';
import { AddressPage } from '../pages/address/address';
import { TransactionsPage } from '../pages/transactions/transactions';
import { ActivityPage } from '../pages/activity/activity';
import { BlockchainPage } from '../pages/blockchain/blockchain';
import { EditAddressPage } from '../pages/edit-address/edit-address';
import { LoaderService } from './services/loader.service';
import { AlertService } from './services/alert.service';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './services/auth.service';

import { ConfirmEmailPage } from '../pages/confirm-email/confirm-email';
import { SendConfirmPage } from '../pages/send-confirm/send-confirm';
import { KeyService } from './services/key.service';

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
    HomePage,
    AccountPage,
    LoginPage,
    RegisterPage,
    ReceivePage,
    SendPage,
    AddressBookPage,
    AddressPage,
    TransactionsPage,
    ActivityPage,
    BlockchainPage,
    EditAddressPage,
    ConfirmEmailPage,
    SendConfirmPage,
  ],
  entryComponents: [
    MyApp,
    HomePage,
    AccountPage,
    LoginPage,
    RegisterPage,
    ReceivePage,
    SendPage,
    AddressBookPage,
    AddressPage,
    TransactionsPage,
    ActivityPage,
    BlockchainPage,
    EditAddressPage,
    ConfirmEmailPage,
    SendConfirmPage,
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    QRCodeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AuthService,
    AlertService,
    FirebaseProvider,
    LoaderService,
    KeyService,
    QRScanner,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler,
    },
    StatusBar,
  ],
})
export class AppModule { }
