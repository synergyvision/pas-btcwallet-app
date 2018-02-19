import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { AddressBookPage } from '../pages/address-book/address-book';
import { TransactionsPage } from '../pages/transactions/transactions';
import { ActivityPage } from '../pages/activity/activity';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { AccountSecurityPage } from '../pages/account-security/account-security';
import { AccountWalletPage } from '../pages/account-wallet/account-wallet';

// Allows to set up Global Static Values thought the App

export class AppSettings {

  public static pagesMenu = [
    { title: 'Inicio', component: HomePage, icon: 'wallet-home' },
    { title: 'Cuenta', component: AccountPage, icon: 'wallet-account' },
    { title: 'Libreta de Contactos', component: AddressBookPage, icon: 'wallet-address-book' },
    { title: 'Transacciones', component: TransactionsPage, icon: 'wallet-transactions' },
    { title: 'Actividad', component: ActivityPage, icon: 'wallet-activity' },
  ];

  public static accountOptions = [
    { title: 'Configuración de Seguridad', component: AccountSecurityPage},
    { title: 'Configuración de las Billeteras', component: AccountWalletPage},
  ];

  public static securityOptions =  [
    { title: 'Restablecer Contraseña', function: 'restorePassword' },
    { title: 'Verificación de dos Pasos', function: 'activateTwoFactorAuth' },
    { title: 'Unir cuenta de Google', function: 'linkGoogleAccount' },
  ];

  public static walletOptions = [
    { title: 'Cambiar Moneda Local', function: 'changeCurrency' },
  ];

  public static registerForm = [
    {
      placeholder: 'Correo Eléctronico', name: 'email', icon: 'wallet-email', type: 'email',
      validators: [Validators.email, Validators.required, Validators.maxLength(30)],
    },
    {
      placeholder: 'Contraseña', name: 'password', icon: 'wallet-password', type: 'password',
      validators: [Validators.required, Validators.minLength(8)],
    },
    {
      placeholder: 'Repetir Contraseña', name: 'passwordRe', icon: 'wallet-password', type: 'password',
      validators: [Validators.required],
    },
  ];

  public static loginForm =  [
    {
      placeholder: 'Correo Electrónico', name: 'email', icon: 'wallet-email', type: 'email',
      validators: [Validators.email, Validators.required, Validators.maxLength(30)],
    },
    {
      placeholder: 'Contraseña', name: 'password', icon: 'wallet-password', type: 'password',
      validators: [Validators.required, Validators.minLength(8)],
    },
  ];
}
