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