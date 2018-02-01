// Interface for the HDWallet Object received by the API
// Info on https://www.blockcypher.com/dev/bitcoin/?javascript#hdwallet

export interface IHDAddress {
    address: string;
    path: string;
    public?: string;
}

export interface IHDChain {
    chain_addresses: IHDAddress[];
    index: number;
}

export interface IHDWallet {
    name?: string;
    token?: string;
    chains: IHDChain;
    hd: boolean;
    extended_public_key: string;
    subchain_indexes: number[];
    addresses?: string[];
}
