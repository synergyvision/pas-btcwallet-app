import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { IBlockchain } from '../models/blockchain';

// REST Service for gettind data from APIs and the Database
// Currently using the BlockCypher API to get Blockchain data

// API Base URL
const URL = 'https://api.blockcypher.com/';

@Injectable()

export class RestService {

  constructor( private http: Http) {}

  // Retrieves the latest BlockChain Data
  public getBlockchain(): Observable<IBlockchain> {
    return this.http.get(URL + 'v1/btc/main')
    .map((res: Response) => {
      return <IBlockchain>res.json();
    })
    .catch(this.handleError);
  }

  // Error Handling for HTTP Errors
  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }
}
