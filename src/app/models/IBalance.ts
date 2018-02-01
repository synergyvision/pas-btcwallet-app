// Interface for the HD Wallet Balance Object
// https://www.blockcypher.com/dev/bitcoin/?javascript#address

import { IHDWallet } from './IHDWallet';

export interface IBalance {
    balance?: number;
    n_tx?: number;
    total_received?: number;
    total_sent?: number;
    unconfirmed_balance?: number;
    unconfirmed_n_tx?: number;
    hd_wallet: IHDWallet;
}
