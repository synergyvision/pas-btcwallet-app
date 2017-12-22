import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { IBlockchain } from '../models/IBlockchain';
import { IAddress } from '../models/IAddress';
import { User } from '../models/user';
import { Address } from '../models/address';
import { IWallet } from '../models/IWallet';

// REST Service for gettind data from APIs and the Database
// Currently using the Blockchain Data API

// API Base URL
const URL = 'https://blockchain.info/es/';

@Injectable()

export class RestService {

  public address: IAddress;
  public user: User;
  public addressBook: Address[];
  public wallet: IWallet;
  private options: RequestOptions;

  constructor(private http: Http) {
    // Headers for local testing
    const headers = new Headers();
    headers.append('&cors', 'true');
    headers.append('Access-Control-Allow-Credentials', 'true');
    this.options = new RequestOptions({ headers: headers });
    // Placeholder Data coming from the API
    this.wallet = {
      guid : '4b8cd8e9-9480-44cc-b7f2-527e98ee3287',
      address: '12AaMuRnzw6vW6s2KPRAGeX53meTf8JbZS',
      label: 'Billetera BTC',
    };
    this.user = new User('nombre',
      'correo@correo.com',
      'assets/imgs/QRCode.png',
      this.wallet);
    this.addressBook = [
      new Address(1, '../../assets/imgs/user.png', 'alias 1', '42sdsvgf93ghg823'),
      new Address(2, '../../assets/imgs/user.png', 'alias 2', 'acnjsdnjwsdsjdsd'),
      new Address(3, '../../assets/imgs/user.png', 'alias 3', 'dfje4y7837yjsdcx'),
    ];
    // this.getSingleAddress('13XXaBufpMvqRqLkyDty1AXqueZHVe6iyy')
    //   .subscribe((data) => {
    //     this.address = data;
    //     this.user.address = this.address;
    //   },
/*       // Error Handling
      (error) => {
        console.log('Error :' + error);
      },
    ); */
  }

  // Retrieves the latest BlockChain data
  public getBlockchain(): Observable<IBlockchain> {
    return this.http.get(URL + 'latestblock', this.options)
      .map((res: Response) => {
        return <IBlockchain>res.json();
      })
      .catch(this.handleError);
  }

  // Gets a Single Address data
  public getSingleAddress(bitcoin_address): Observable<IAddress> {
    return this.http.get(URL + 'rawaddr/' + bitcoin_address, this.options)
      .map((res: Response) => {
        return <IAddress>res.json();
      })
      .catch(this.handleError);
  }

  // Error Handling for HTTP Errors
  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }
}
