import { IKeys } from './IKeys';
import { IBalance } from './IBalance';
import { CryptoCoin } from './crypto';
import { Wallet } from './wallet';
import { ITransaction } from './ITransaction';

// Object to be Stored on the Firebase RealTime DB
export interface IPendingTxs {
    createdBy: string;
    amount: number;
    to: string;
    fee: number;
    approved: [{
        user: string;
    }];
    rejected: [{
        user: string;
    }];
    tx: ITransaction;
}

export interface IMSWalletRequest {
    key?: string;
    type?: string;
    createdBy?: string;
    crypto?: string;
    signers?: any[];
    accepted?: string[];
}

export interface ISigner {
    email: string;
    pubKey?: any;
    uid: string;
}
export class MultiSignedWallet {
    public key?: string;
    public name?: string;
    public signers?: ISigner[];
    public crypto?: CryptoCoin;
    public type: string;
    // For ethereum wallets
    public address?: string;
    public pendingTxs: IPendingTxs[];

    constructor(name?: string, crypto?: CryptoCoin, users?: ISigner[], type?: string, address?: string) {
        this.name = name;
        this.crypto = crypto;
        this.signers = Object.values(Object.assign({}, users));
        this.iKeyToString();
        this.type = type;
        this.address = address;
        this.pendingTxs = [];
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
