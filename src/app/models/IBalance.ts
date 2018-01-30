import { Wallet } from './wallet';

export interface IBalance {
    balance?: number;
    n_tx?: number;
    total_received?: number;
    total_sent?: number;
    unconfirmed_balance?: number;
    unconfirmed_n_tx?: number;
    wallet: Wallet;
}
