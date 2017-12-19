// Interface for the Blockchain Object of BlockCypher
// Info on https://www.blockcypher.com/dev/bitcoin/?javascript#blockchain

export interface IBlockchain {
    name: string;
    height: number;
    hash: string;
    time: string;
    latest_url: string;
    previous_hash: string;
    previous_url: string;
    peer_count: number;
    high_fee_per_kb: number;
    medium_fee_per_kb: number;
    low_fee_per_kb: number;
    unconfirmed_count: number;
    last_fork_height?: number;
    last_fork_hash?: string;
}
