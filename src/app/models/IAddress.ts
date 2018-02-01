// Interface for Address Data received by the API
// Info on https://www.blockcypher.com/api

export interface IAddress {
    address: string;
    n_tx: number;
    total_received: number;
    total_sent: number;
    final_balance: number;
    private: string;
    public: string;
    wif: string;
    balance: number;
    unconfirmed_balance: number;
    final_n_tx: number;
}
