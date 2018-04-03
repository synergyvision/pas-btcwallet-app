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