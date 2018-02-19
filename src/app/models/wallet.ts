import { Keys } from './keys';
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
    public keys?: Keys;
    public balance?: IBalance;
    public crypto?: CryptoCoin;

    constructor(name?: string, key?: Keys, crypto?) {
        this.name = name;
        this.keys = key;
        this.crypto = crypto;
    }
}
