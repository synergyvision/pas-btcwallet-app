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
import { AlertService } from './alert.service';
import { FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';

// REST Service for getting data from APIs and the Database
// Currently using the Blockchain Data API

// API Base URL
const URL = 'https://blockchain.info/es/';
// Must have BlockchainInfo Wallet Service Running on same environment
const WALLET_URL = 'http://localhost:300/api/v2/Create';
// API Base URL for the Testnet
const TESTING_URL = 'https://api.blockcypher.com/v1/bcy/test';
const TOKEN = '6947d4107df14da5899cb2f87a9bb254';
// API KEY issued to Synergy Vision
const API_KEY = 'd08f9cd-268e-4875-a881-495a0a3aeb65';

@Injectable()

export class RestService {

  public avatar = '../../assets/imgs/user.png';
  public address: IAddress;
  public user: User;
  public addressBook: Address[];
  public wallet: IWallet;
  public blockChain: IBlockchain;
  public activityList: Activity[];
  public transactionList: Transaction[];
  public public: string;
  private options: RequestOptions;

  constructor(private http: Http, private loadService: LoaderService, private alertService: AlertService, 
              private firebaseData: FirebaseProvider) {

    // Headers for get
    const headers = new Headers();
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });

    
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
  }

  // Retrieves the latest BlockChain data
  public getBlockchain(): Observable<IBlockchain> {
    this.loadService.showLoader('Recuperando Información');
    return this.http.get(URL + 'latestblock', this.options)
      .map((res: Response) => {
        this.blockChain = res.json();
        return res.json() as IBlockchain;
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
        return res.json() as IAddress;
      })
      .catch(this.handleError);
  }

  public showAlert(msg?, title?): Promise<any> {
    return this.alertService.showAlert(msg, title);
  }

  public createData(email: string, password: string, uid: string): Observable<Observable<IWallet>> {
    // Main Blockchain Info
    const body = {
      $password: password,
      $api_code: API_KEY,
      $label: 'Main BTC Wallet',
      $email: email,
    };

    /*     return this.http.post(WALLET_URL, body, this.options)
          .map((res: Response) => {
            console.log(res);
            console.log(res.json());
            return <IWallet>res.json();
          })
          .catch(this.handleError); */

    // Testnet Blockcypher
    return this.createAddress()
      .map((address) => {
        this.address = address;
        const data = {
          name: uid.substring(0, 25),
          addresses: [
            this.address.address,
          ],
        };
        return this.createWallet(JSON.stringify(data));
      }).catch(this.handleError);
  }

  // Returns a wallet to be used on BlockCypher Testnet API
  public createWallet(data): Observable<IWallet> {
    return this.http.post(TESTING_URL + '/wallets?token=' + TOKEN, data)
      .map((res: Response) => {
        return res.json() as IWallet;
      })
      .catch(this.handleError);
  }

  // Returns a random generated address form the BlockCypher Testnet API
  public createAddress(): Observable<IAddress> {
    return this.http.post(TESTING_URL + '/addrs', null, this.options)
      .map((res: Response) => {
        return res.json() as IAddress;
      })
      .catch(this.handleError);
  }

  // Error Handling for HTTP Errors
  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }

}
