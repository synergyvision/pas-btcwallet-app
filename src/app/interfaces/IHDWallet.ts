
import { IHDChain } from './IHDChain';
import { CryptoCoin } from '../models/crypto';

// Interface for the HDWallet Object received by the API
// Info on https://www.blockcypher.com/dev/bitcoin/?javascript#hdwallet

export interface IHDWallet {
    name?: string;
    token?: string;
    chains?: IHDChain;
    hd?: boolean;
    extended_public_key?: string;
    subchain_indexes?: number[];
    addresses?: string[];
    crypto?: CryptoCoin;
    multiSignedKey?: string;
    address?: string;
}
