// Interface for the Wallet Object
// Info on https://blockchain.info/api/blockchain_api

export interface IWallet {
    guid: string;
    address: string;
    label?: string;
    // Required for importing wallets
    priv_key?: string;
    // Required to do transactions
    password?: string;
    // Required if double encryption is enabled
    second_password?: string;
}
