// Interface for the Transaction Object received by the API
// Info on https://www.blockcypher.com/dev/bitcoin/?javascript#tx

export interface Itransaction {
    hash: string;
    ver: number;
    vin_sz: number;
    vout_sz: number;
    lock_time: string;
    size: number;
    relayed_by: string;
    block_height: number;
    tx_index: number;
    inputs: [
        {
            prev_out: {
                 hash: string;
                 value: string;
                 tx_index: number;
                 n: string;
            };
            script: string;
        }
    ];
    out: [
        {
            value: number;
            hash: string;
            script: string;
        }

    ];
}
