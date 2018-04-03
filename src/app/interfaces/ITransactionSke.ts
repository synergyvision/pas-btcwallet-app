import { ITransaction } from './ITransaction';

export interface ITransactionSke {
    tx: ITransaction;
    tosign: string[];
    signatures: string[];
    pubkeys?: string[];
    tosign_tx?: string[];
    errors?: string[];
}