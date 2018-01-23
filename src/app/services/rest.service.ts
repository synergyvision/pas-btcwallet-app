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
import { Wallet } from '../models/wallet';
import { IBalance } from '../models/IBalance';

// REST Service for getting data from APIs and the Database

// API Base URL for the Testnet
const URL = 'https://api.blockcypher.com/v1/btc/main';
const TESTING_URL = 'https://api.blockcypher.com/v1/bcy/test';
const TOKEN = '6947d4107df14da5899cb2f87a9bb254';

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
  public balance: Observable<IBalance>;
  private options: RequestOptions;

  constructor(private http: Http, private loadService: LoaderService, private alertService: AlertService,
              private databaseProvider: FirebaseProvider) {

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
    return this.http.get(URL, this.options)
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

  // Gets an Address Information
  public getSingleAddress(bitcoin_address): Observable<IAddress> {
    return this.http.get(TESTING_URL + '/addrs/' + bitcoin_address + '/balance', this.options)
      .map((res: Response) => {
        return res.json() as IAddress;
      }).catch(this.handleError);
  }

  // Checks if an address was used
  public verifyAddress(wallet: Wallet, uid: string): Observable<any> {
    const bitcoin_address = wallet.addresses.pop();
    return this.getSingleAddress(bitcoin_address)
      .map((data) => {
        const address = data;
        // If it was used, we create a new address
        if ((address.balance > 0) || (address.n_tx > 0)) {
          return this.addAddressToWallet(wallet, uid);
        } else {
          return bitcoin_address;
        }
      });
  }

    // Creates an Address
    public createAddress(): Observable<IAddress> {
      return this.http.post(TESTING_URL + '/addrs', null, this.options)
        .map((res: Response) => {
          return res.json() as IAddress;
        })
        .catch(this.handleError);
    }

  // Creates a new Wallet
  public createData(email: string, password: string, uid: string): Observable<Observable<IWallet>> {
    return this.createAddress()
      .map((address) => {
        this.address = address;
        const data = {
          name: 'W' + uid.substring(0, 24),
          addresses: [
            this.address.address,
          ],
        };
        return this.createWallet(JSON.stringify(data));
      }).catch(this.handleError);
  }

  // Returns a new wallet
  public createWallet(data): Observable<IWallet> {
    return this.http.post(TESTING_URL + '/wallets?token=' + TOKEN, data)
      .map((res: Response) => {
        return res.json() as IWallet;
      })
      .catch(this.handleError);
  }

  // Adds an Address to a wallet
  public addAddressToWallet(wallet: Wallet, uid: string): Observable<IAddress> {
    return this.createAddress()
      .map((newAddress) => {
        const address = newAddress;
        const body = { 'addresses': [address] };
        return this.http.post(TESTING_URL + '/wallets/' + wallet.name + '/addresses?token=' + TOKEN,
          JSON.stringify(body), this.options)
          .map((res: Response) => {
            this.databaseProvider.addAddressToWallet(wallet, uid, res.json());
            return address;
          })
          .catch(this.handleError);
      })
      .catch(this.handleError);
  }

  // Gets a Wallet Balance
  public getBalanceFromWallet(wallet: Wallet) {
    this.balance = this.http.get(TESTING_URL + '/addrs/' + wallet.name + '/balance?token=' + TOKEN)
    .map((res: Response) => {
      return res.json() as IBalance;
    })
    .catch(this.handleError);
  }

  public showAlert(msg?, title?): Promise<any> {
    return this.alertService.showAlert(msg, title);
  }

  // Error Handling for HTTP Errors
  private handleError(error: Response) {
    console.log(error);
    return Observable.throw(error.statusText);
  }

}
