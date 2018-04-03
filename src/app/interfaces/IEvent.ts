// Interfaces for the objects of the Events API
// More Info on:
// https://www.blockcypher.com/dev/bitcoin/?javascript#event

export interface IEvent {
    id?: string;
    event?: string;
    hash?: string;
    wallet_name?: string;
    token?: string;
    address?: string;
    confirmations?: number;
    confidence?: number;
    script?: string;
    url?: string;
    callback_errors?: number;
}

