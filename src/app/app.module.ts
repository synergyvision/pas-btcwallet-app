import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Slides } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { QRScanner } from '@ionic-native/qr-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { NgPipesModule } from 'ngx-pipes';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// i18n Imports
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Firebase And Services
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { AlertService } from './services/alert.service';
import { LoaderService } from './services/loader.service';
import { KeyService } from './services/key.service';
import { AuthService } from './services/auth.service';

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
import { EditAddressPage } from '../pages/edit-address/edit-address';
import { ConfirmEmailPage } from '../pages/confirm-email/confirm-email';
import { SendConfirmPage } from '../pages/send-confirm/send-confirm';
import { AccountSecurityPage } from '../pages/account-security/account-security';
import { AccountWalletPage } from '../pages/account-wallet/account-wallet';
import { TransactionConfirmationPage } from '../pages/transaction-confirmation/transaction-confirmation';
import { CreateWalletPage } from '../pages/create-wallet/create-wallet';
import { BlockchainPage } from '../pages/blockchain/blockchain';
import { EventService } from './services/events.services';
import { ExchangeService } from './services/exchange.service';
import { ExchangePage } from '../pages/exchange/exchange';
import { SharedService } from './services/shared.service';
import { RestService } from './services/rest.service';

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
    EditAddressPage,
    ConfirmEmailPage,
    SendConfirmPage,
    AccountSecurityPage,
    AccountWalletPage,
    TransactionConfirmationPage,
    CreateWalletPage,
    BlockchainPage,
    ExchangePage,
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
    EditAddressPage,
    ConfirmEmailPage,
    SendConfirmPage,
    AccountSecurityPage,
    AccountWalletPage,
    TransactionConfirmationPage,
    CreateWalletPage,
    BlockchainPage,
    ExchangePage,
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    NgPipesModule,
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
    FirebaseProvider,
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
