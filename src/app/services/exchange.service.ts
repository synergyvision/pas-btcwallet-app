import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { AppData } from '../app.data';
import { IExchange } from '../interfaces/IExchange';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../config/appConstants';

const URL = AppConstants.EXCHANGE_API_URL;
const MARKET_URL = AppConstants.MARKET_API_URL;

@Injectable()

/*
Service for handling the data sent by the Shapeshift API and CryptoCompare
Shapeshift is an exchange service that allows user to exchange between crypto coins. Currently untested
due to not having real currencies
CryptoCompare sends data on real time about the value of coins on hard currencies such as USD and EUR
*/

export class ExchangeService {

    constructor(private http: HttpClient) {

    }

    public getExchangeRate(input: string, output: string): Observable<IExchange> {
        const pair = this.getExchangePair(input, output);
        return this.getExchange(pair);
    }

    //WIP
    public getCryptoExchange(currency: string): Observable<any[]> {
        return this.http.get(MARKET_URL + currency )
        .map((response) => {
            const cryptoList = Object.keys(response);
            const exchangeList = Object.values(response);
            return cryptoList.map((value) => {
                return {
                    crypto: value,
                    exchange: exchangeList.shift()[currency],
                };
            });
        });
    }
/*
    private getCurrencyRate(currency: string[]): number {
        this.http.get.
    }
 */
//FINWIP
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

    private getMarketCrypto(crypto: string) {
        return crypto;
    }
}
