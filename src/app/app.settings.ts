// Allows to set up Global Static Values thought the App

export class AppSettings {

  public static pagesMenu = [
    { title: 'Inicio', component: 'HomePage', icon: 'wallet-home' },
    { title: 'Cuenta', component: 'AccountPage', icon: 'wallet-account' },
    { title: 'Libreta de Contactos', component: 'AddressBookPage', icon: 'wallet-address-book' },
    { title: 'Transacciones', component: 'TransactionsPage', icon: 'wallet-transactions' },
    { title: 'Actividad', component: 'ActivityPage', icon: 'wallet-activity' },
    { title: 'Exchange', component: 'ExchangePage', icon: 'wallet-activity'},
    { title: 'Blockchain', component: 'BlockchainPage', icon: 'wallet-transactions'},
  ];

  public static accountOptions = [
    { title: 'Configuración de Seguridad', component: 'AccountSecurityPage'},
    { title: 'Configuración de Billeteras', component: 'AccountWalletPage'},
  ];

  public static securityOptions =  [
    { title: 'Restablecer Contraseña', function: 'restorePassword' },
    { title: 'Verificación de dos Pasos', function: 'activateTwoFactorAuth' },
  ];

  public static walletOptions = [
    { title: 'Cambiar Moneda Local', value: 'changeCurrency' },
    { title: 'Cambiar Unidades de Moneda', value: 'changeCryptoUnit'},
    { title: 'Exportar Billetera', value: 'exportWallet'},
    { title: 'Mostrar Clave de Recuperacion', value: 'showMnemonics'},
    { title: 'Importar Billetera', value: 'importWallet'},
  ];
}
