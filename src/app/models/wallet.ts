import { IKeys } from './IKeys';
import { IBalance } from './IBalance';
import { CryptoCoin } from './crypto';
import { KeysPipe } from 'ngx-pipes';

// Object to be Stored on the Firebase RealTime DB

export class Wallet {
    public key?: string;
    public name?: string;
    public keys?: IKeys;
    public crypto?: CryptoCoin;
    // For ethereum wallets
    public address?: string;
    public multiSignedKey: string;

    constructor(name?: string, keys?: IKeys, crypto?: CryptoCoin, address?: string, key?: string) {
        this.name = name;
        this.keys = keys || undefined;
        this.crypto = crypto;
        this.address = address || undefined;
        this.multiSignedKey = key;
    }
}
