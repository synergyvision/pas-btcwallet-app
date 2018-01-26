import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { AddressBookPage } from '../pages/address-book/address-book';
import { TransactionsPage } from '../pages/transactions/transactions';
import { ActivityPage } from '../pages/activity/activity';
import { BlockchainPage } from '../pages/blockchain/blockchain';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

// Allows to set up Global Static Values thought the App

export class AppSettings {

  public static pagesMenu = [
    { title: 'Inicio', component: HomePage, icon: 'wallet-home' },
    { title: 'Cuenta', component: AccountPage, icon: 'wallet-account' },
    { title: 'Libreta de Contactos', component: AddressBookPage, icon: 'wallet-address-book' },
    { title: 'Transacciones', component: TransactionsPage, icon: 'wallet-transactions' },
    { title: 'Actividad', component: ActivityPage, icon: 'wallet-activity' },
    { title: 'Datos del BlockChain', component: BlockchainPage, icon: 'wallet-transactions' },
  ];

  public static accountOptions = [
    { title: 'Correo Electrónico' }, // component}
    { title: 'Nombre del Usuario' }, // component: HomePage },
    { title: 'Contraseña' }, // component: ListPage },
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
