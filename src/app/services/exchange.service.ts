import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { AppData } from '../app.data';
import { Observable } from 'rxjs/Observable';
import { ErrorService } from './error.service';
import { IExchange } from '../interfaces/IExchange';


const URL = 'https://cors.shapeshift.io';
const MARKET_URL = 'https://api.coinmarketcap.com/v1/';

@Injectable()

export class ExchangeService {

    constructor(private http: Http) {

    }

    public getExchange(pair: string): Observable<IExchange> {
        return this.http.get(URL + '/marketinfo/' + pair)
            .map((res: Response) => {
                return res.json() as IExchange;
            })
            .catch(this.handleError);
    }

    // Exchange Functions

    public getExchangePair(input: string, output: string): string {
        const input_pair = AppData.exchangePairs.filter((p) => {
            return p.crypto === input;
        }).pop().name;
        const output_pair = AppData.exchangePairs.filter((p) => {
            return p.crypto === output;
        }).pop().name;
        return input_pair + '_' + output_pair;
    }

    public getExchangeRate(input: string, output: string): Observable<IExchange> {
        const pair = this.getExchangePair(input, output);
        return this.getExchange(pair);
    }

    // public exchangeCurrencies(input: string, output: string, amount: number)

    private handleError(er): Observable<any> {
        console.log(er);
        if (er.title) {
            return Observable.throw(er);
        } else {
            const error = new ErrorService(er.status, er._body);
            return Observable.throw(error);
        }
    }
}
