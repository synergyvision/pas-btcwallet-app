import { IKeys } from './IKeys';
import { CryptoCoin } from './crypto';
import { Wallet } from './wallet';
import { ITransactionSke } from '../interfaces/ITransactionSke';

// Object to be Stored on the Firebase RealTime DB
export interface IPendingTxs {
    createdBy?: string;
    createdDate?: Date;
    amount?: number;
    to?: string;
    fee?: number;
    approved?: string[];
    dismissed?: string[];
    tx?: ITransactionSke;
    key?: string;
    wallet?: string;
    signers?: any;
}

export interface IMSWalletRequest {
    key?: string;
    type?: string;
    createdBy?: string;
    crypto?: string;
    signers?: any;
    users?: ISigner[];
    accepted?: string[];
}

export interface ISigner {
    pubKey?: any;
    uid?: string;
    email?: string;
}
export class MultiSignedWallet {
    public key?: string;
    public name?: string;
    public signers?: ISigner[];
    public crypto?: CryptoCoin;
    public type?: string;
    public address?: string;

    constructor(name?: string, crypto?: CryptoCoin, users?: ISigner[], type?: string,
                address?: string, rejectsCancels?: boolean) {
        this.name = name;
        this.crypto = crypto;
        this.signers = Object.values(Object.assign({}, users));
        this.iKeyToString();
        this.type = type;
        this.address = address;
    }

    public toWallet(key?: string): Wallet {
        return new Wallet(this.name, undefined, this.crypto, this.address, key);
    }

    private iKeyToString() {
        this.signers.forEach((signer) => {
            signer.pubKey = signer.pubKey.xpub;
        });
    }
}
