import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

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
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler,
    },
    LoaderService,
    AlertService,
  ],
})
export class AppModule { }
