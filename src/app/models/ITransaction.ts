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
        addresses: string[];
        hd_path: string;
        output_index: number;
        output_value: number;
        prev_hash: string;
        script_type: string;
        script: string;
        sequence: number;
        age?: number;
        wallet_name?: string;
        wallet_token?: string;

    }];
    outputs: [{
        addresses: string[];
        script: string;
        script_type: string;
        value: number;
        spent_by?: string;
        data_hex?: string;
        data_string?: string;
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

export interface ITransactionSke {
    tx: ITransaction;
    tosign: string[];
    signatures: string[];
    pubkeys: string[];
    tosign_tx: string[];
    errors?: string[];
}
