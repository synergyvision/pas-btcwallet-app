import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { AppData } from '../app.data';
import { Observable } from 'rxjs/Observable';
import { ErrorService } from './error.service';
import { IExchange } from '../models/IExchange';

const URL =  'https://cors.shapeshift.io';

@Injectable()

export class ExchangeService {

    constructor(private http: Http) {

    }

    public getExchangeRate(pair: string): Observable<IExchange> {
        return this.http.get(URL + '/marketinfo/' + pair)
        .map((res: Response) => {
            return res.json() as IExchange;
        })
        .catch(this.handleError);
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
