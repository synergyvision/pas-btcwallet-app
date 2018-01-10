// Interface for the Blockchain Object
// Info on https://blockchain.info/api/blockchain_api

export interface IBlockchain {
    hash: string;
    time: number;
    block_index: number;
    height: number;
    txIndexes: number[];
}
