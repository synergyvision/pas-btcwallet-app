
export interface IHDAddress {
    address: string;
    path: string;
    public?: string;
}

export interface IHDChain {
    chain_addresses: IHDAddress[];
    index: number;
}
