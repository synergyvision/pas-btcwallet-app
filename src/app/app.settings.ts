import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { AddressBookPage } from '../pages/address-book/address-book';
import { TransactionsPage } from '../pages/transactions/transactions';
import { ActivityPage } from '../pages/activity/activity';
import { BlockchainPage } from '../pages/blockchain/blockchain';

// Allows to set up Global Static Values thought the App

export class AppSettings {
    public pagesMenu = [
        { title: 'Inicio', component: HomePage },
        { title: 'Cuenta', component: AccountPage },
        { title: 'Libreta de Contactos', component: AddressBookPage },
        { title: 'Transacciones', component: TransactionsPage },
        { title: 'Actividad', component: ActivityPage },
        { title: 'Datos del BlockChain', component: BlockchainPage },
      ];
}
