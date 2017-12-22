// Interface for Address Data
// Info on https://blockchain.info/api/blockchain_api

export interface IAddress {
    hash160: string;
    address: string;
    n_tx: number;
    n_unredeemed: number;
    total_received: number;
    total_sent: number;
    final_balance: number;
}
