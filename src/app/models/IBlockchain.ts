// Interface for the Blockchain Object

export interface IBlockchain {
    name: string;
    hash: string;
    height: number;
    time: number;
    peer_count: number;

    // Ethereum only Blockchain fields
    high_gas_price?: number;
    medium_gas_price: number;
    low_gas_price?: number;
}

export interface IBlock {
    hash: string;
    height: number;
    depth: number;
    chain: string;
    total: number;
    fees: number;
    size: number;
    ver: number;
    time: string;
    received_time: string;
    nonce: number;
    prev_block: string;
    txids: string[];
    tx_url: string;
    n_tx: number;

    // Ethereum only
    mrkl_root?: string;
}
