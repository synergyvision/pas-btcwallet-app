import { CryptoCoin } from '../models/crypto';
import { IHDWallet } from './IHDWallet';
import { ITransaction } from './ITransaction';
import { Observable } from 'rxjs';

// Interface for Address Data received by the API
// Info on https://www.blockcypher.com/api

export interface IAddress {
    address?: string;
    hd_wallet?: IHDWallet;
    total_received?: number;
    total_sent?: number;
    balance?: number;
    unconfirmed_balance?: number;
    final_balance?: number;
    n_tx?: number;
    unconfirmed_n_tx?: number;
    final_n_tx?: number;
    tx_url?: string;
    txs?: ITransaction[];
    private?: string;
    public?: string;
    wif?: string;
    crypto?: CryptoCoin;
    wallet?: IHDWallet;
    txrefs?: ITransaction[];
    pubkeys?: string[];
    script_type: string;
    exchange?: number;
}
