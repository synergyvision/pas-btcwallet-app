// Interface Object for Exchange Requests and querys
// Used by the ShapeShift API

export interface IExchange {
    pair: string;
    limit: string;
    rate?: number;
    min?: number;
    minerFee: number;
}
