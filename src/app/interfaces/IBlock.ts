
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
