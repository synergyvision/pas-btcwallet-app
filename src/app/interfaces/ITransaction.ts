import { ITInput } from "./ITInput";
import { ITOutput } from "./ITOutput";

// Interface for the Transaction Object received by the API
// Info on https://www.blockcypher.com/dev/bitcoin/?javascript#tx

// TX Object
export interface IWalletTrx {
    wallet: any;
    trxList: ITransaction[];
}

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
    // Ethereum only
    gas_used?: number;
    gas_price?: number;
    tx_input_n?: number;
    tx_output_n?: number;
    value?: number;
}
