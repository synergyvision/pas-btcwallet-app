import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { AppData } from '../app.data';
import { Observable } from 'rxjs/Observable';
import { IExchange } from '../interfaces/IExchange';
import { HttpClient } from '@angular/common/http';

const URL = 'https://cors.shapeshift.io';
const MARKET_URL = 'https://min-api.cryptocompare.com/data/';

@Injectable()

export class ExchangeService {

    constructor(private http: HttpClient) {

    }

    public getExchangeRate(input: string, output: string): Observable<IExchange> {
        const pair = this.getExchangePair(input, output);
        return this.getExchange(pair);
    }
/* 
    private getCurrencyRate(currency: string[]): number {
        this.http.get.
    }
 */
    private getExchange(pair: string): Observable<IExchange> {
        return this.http.get(URL + '/marketinfo/' + pair)
        .map((res) => {
            return res as IExchange;
        });
    }

    // Exchange Functions

    private getExchangePair(input: string, output: string): string {
        const input_pair = AppData.exchangePairs.filter((p) => {
            return p.crypto === input;
        }).pop().name;
        const output_pair = AppData.exchangePairs.filter((p) => {
            return p.crypto === output;
        }).pop().name;
        return input_pair + '_' + output_pair;
    }
}
