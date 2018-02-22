import { IKeys } from './IKeys';
import { IBalance } from './IBalance';
import { CryptoCoin } from './crypto';

// Object to be Stored on the Firebase RealTime DB

export interface IChainAddress {
    address: string;
    path: string;
}

export class Wallet {
    public key?: string;
    public name?: string;
    public keys?: IKeys;
    public balance?: IBalance;
    public crypto?: CryptoCoin;
    public address?: string;

    constructor(name?: string, key?: IKeys, crypto?) {
        this.name = name;
        this.keys = key;
        this.crypto = crypto;
    }
}
