import { Keys } from './keys';

// Object to be Stored on the Firebase RealTime DB

export interface IChainAddress {
    address: string;
    path: string;
}

export class Wallet {
    public key?: string;
    public name: string;
    public keys?: Keys;

    constructor(name: string, key?: Keys) {
        this.name = name;
        this.keys = key;
    }
}
