// Interface for the Transaction Object received by the API
// Info on https://www.blockcypher.com/dev/bitcoin/?javascript#tx

// TX Object
export interface ITransaction {
    block_height: number;
    hash: string;
    addresses: string[];
    total: number;
    fees: number;
    size: number;
    preference: string;
    relayed_by: string;
    received: Date;
    ver: number;
    lock_time: number;
    double_spend: boolean;
    vin_sz: number;
    vout_sz: number;
    confirmations: number;
    inputs: ITInput[];
    outputs: ITOutput[];
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
    filtering_value?: string;
}

// TXSKeleton Object
export interface ITransactionSke {
    tx: ITransaction;
    tosign: string[];
    signatures: string[];
    pubkeys: string[];
    tosign_tx: string[];
    errors?: string[];
}

// TXInput Object
export interface ITInput {
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

}

// TXOutpu Object
export interface ITOutput {
    addresses: string[];
    script: string;
    script_type: string;
    value: number;
    spent_by?: string;
    data_hex?: string;
    data_string?: string;
}