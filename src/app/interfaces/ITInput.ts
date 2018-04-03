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