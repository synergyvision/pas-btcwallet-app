// Interface for the Blockchain Object

export interface IBlockchain {
    name: string;
    hash: string;
    height: number;
    time: number;
    peer_count: number;
}
