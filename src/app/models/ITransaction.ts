// Interface for the Transaction Object received by the API
// Info on https://www.blockcypher.com/dev/bitcoin/?javascript#tx

export interface ITransaction {
    block_height: number;
    hash: string;
    addresses: string[];
    total: number;
    fees: number;
    size: number;
    preference: string;
    relayed_by: string;
    received: string;
    ver: number;
    lock_time: number;
    double_spend: boolean;
    vin_sz: number;
    vout_sz: number;
    confirmations: number;
    inputs: [{

    }];
    outputs: [{

    }];
    pot_in_rbf?: boolean;
    confidence?: number;
    confirmed?: string;
    receive_count?: number;
    change_address?: string;
    block_hash?: string;
    block_index?: number;
    double_of?: string;
    data_protocol?: string;
    hex?: string;
}

export interface ITransacionSke {
    tx: ITransaction;
    tosign: string[];
    signatures: string[];
    pubkeys: string[];
    tosign_tx: string[];
    errors?: string[];
}
