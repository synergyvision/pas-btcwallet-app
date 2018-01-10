import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from './loader.service';
import { IAddress } from '../models/IAddress';
import { User } from '../models/user';
import { Address } from '../models/address';
import { IWallet } from '../models/IWallet';
import { IBlockchain } from '../models/IBlockchain';
import { Activity } from '../models/activity';
import { Transaction } from '../models/transaction';

// REST Service for gettind data from APIs and the Database
// Currently using the Blockchain Data API

// API Base URL
const URL = 'https://blockchain.info/es/';

// API KEY issued to Synergy Vision
const API_KEY = 'd08f9cd-268e-4875-a881-495a0a3aeb65';

@Injectable()

export class RestService {
  public address: IAddress;
  public user: User;
  public addressBook: Address[];
  public wallet: IWallet;
  public blockChain: IBlockchain;
  public activityList: Activity[];
  public transactionList: Transaction[];
  private options: RequestOptions;

  constructor(private http: Http, private loadService: LoaderService) {
    // Headers for local testing
    const headers = new Headers();
    headers.append('&cors', 'true');
    headers.append('Access-Control-Allow-Credentials', 'true');
    this.options = new RequestOptions({ headers: headers });

    // Placeholder Data coming from the API
    this.wallet = {
      guid: '4b8cd8e9-9480-44cc-b7f2-527e98ee3287',
      address: '12AaMuRnzw6vW6s2KPRAGeX53meTf8JbZS',
      label: 'Billetera BTC',
    };
    this.user = new User('Nombre',
      'correo@correo.com',
      'assets/imgs/QRCode.png',
      this.wallet,
      '../../assets/imgs/user.png',
      );
    this.addressBook = [
      new Address(1, '../../assets/imgs/user.png', 'alias 1', '42sdsvgf93ghg823'),
      new Address(2, '../../assets/imgs/user.png', 'alias 2', 'acnjsdnjwsdsjdsd'),
      new Address(3, '../../assets/imgs/user.png', 'alias 3', 'dfje4y7837yjsdcx'),
    ];
    this.activityList = [
      new Activity(1, '12/12/2017', 'Acceso desde dispositivo Android NG-7800'),
      new Activity(2, '06/11/2017', 'Cambio de clave'),
      new Activity(3, '05/04/2017', 'Se agregaron 00,156 BTC a la billetera'),
      new Activity(4, '28/03/2017', 'Se agregaron 00,23 BTC a la billetera'),
      new Activity(5, '14/01/2017', 'Cambio de clave'),
      new Activity(6, '28/12/2016', 'Acceso desde dispositivo iPhone 6c'),
    ];
    this.transactionList = [
      new Transaction(1, '12/12/2017', '34ryjhgcs35hjkjl3125lk34324s0944klnfcsjdfdsofkdofkdskfofssf', 0.3423, 0),
      new Transaction(2, '11/12/2017', '343sdsd12sed5jh343jhjhjh839281fhn19403nc903i3iencjdiofw0w24', 0.00023, 9.20),
      new Transaction(3, '09/12/2017', 'acbvy34fds353125ghgda3432sd24rewfwdqw432|7684rerqecxz231414', 0.00000232, 3.40),
    ];

    // For getting the user info

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
      this.loadService.showLoader('Recuperando Información');
      return this.http.get(URL + 'latestblock', this.options)
        .map((res: Response) => {
          this.blockChain = res.json();
          console.log(this.blockChain);
          return <IBlockchain>res.json();
        })
        .catch(this.handleError)
        .finally(() => {
          this.loadService.dismissLoader();
        },
      );
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
