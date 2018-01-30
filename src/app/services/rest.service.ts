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
import { ErrorService } from './error.service';

// REST Service for getting data from APIs and the Database

// API Base URL for the Testnet
const URL = 'https://api.blockcypher.com/v1/btc/main';
const TESTING_URL = 'https://api.blockcypher.com/v1/bcy/test';
const TOKEN = '6947d4107df14da5899cb2f87a9bb254';

@Injectable()

export class RestService {

  public blockChain: IBlockchain;
  public activityList: Activity[];
  public transactionList: Transaction[];
  public balance: Observable<IBalance>;
  public walletFunds: number;
  private options: RequestOptions;

  constructor(private http: Http, private loadService: LoaderService, private alertService: AlertService,
              private databaseProvider: FirebaseProvider) {

    this.activityList = [
      new Activity(1, '12/12/2017', 'Acceso desde dispositivo Android NG-7800'),
      new Activity(2, '06/11/2017', 'Cambio de clave'),
      new Activity(3, '05/04/2017', 'Se agregaron 00,156 BTC a la billetera'),
      new Activity(4, '28/03/2017', 'Se agregaron 00,23 BTC a la billetera'),
      new Activity(5, '14/01/2017', 'Cambio de clave'),
      new Activity(6, '28/12/2016', 'Acceso desde dispositivo iPhone 6c'),
    ];
    this.transactionList = [
      new Transaction(1, '12/12/2017', 0.3423, 'C4iXKfquu1pBp3Xzw612iTgaHPSK7V7cH6', null),
      new Transaction(2, '11/12/2017', 0.00023, 'A3gYLgpvv2qCq4Yax723hLhbIQTL8W8dI7', 'Luis Carlos' ),
      new Transaction(3, '09/12/2017', 0.00000232, 'R4ncLtujcA42uFsxSEW31lVCxsrqe51dsa', 'María'),
    ];
  }

  // Retrieves the latest BlockChain data
  public getBlockchain(): Observable<IBlockchain> {
    this.loadService.showLoader('Recuperando Información');
    return this.http.get(URL)
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
    return this.http.get(TESTING_URL + '/addrs/' + bitcoin_address + '/balance')
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
          return this.addAddressToWallet(wallet);
        } else {
          return bitcoin_address;
        }
      });
  }

    // Creates an Address
    public createAddress(): Observable<IAddress> {
      return this.http.post(TESTING_URL + '/addrs', null)
        .map((res: Response) => {
          return res.json() as IAddress;
        })
        .catch(this.handleError);
    }

  // Creates a new Wallet
  public createData(email: string, uid: string): Observable<IWallet> {
    return this.createAddress()
    .first()
    .flatMap((address) => {
        const data = {
          name: 'W' + uid.substring(0, 24),
          addresses: [
            address.address,
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
      });
  }

  // Adds an Address to a wallet
  public addAddressToWallet(wallet: Wallet): Observable<any> {
    return this.http.post(TESTING_URL + '/wallets' + wallet.name +
      'addresses/generate?token=' + TOKEN, {})
      .map((res) => {
      return res.json() as Wallet;
    });
  }

  // Gets a Wallet Balance
  public getBalanceFromWallet(wallet: Wallet) {
    this.balance = this.http.get(TESTING_URL + '/addrs/' + wallet.name + '/balance?token=' + TOKEN)
    .map((res: Response) => {
      return res.json() as IBalance;
    })
    .catch(this.handleError);
  }

  public showAlert(error: ErrorService): Promise<any> {
    return this.alertService.showAlert(error.message, error.title, error.subTitle);
  }

  public showFullAlert(error: ErrorService): Promise<any> {
    return this.alertService.showFullAlert(error.message, error.title, error.subTitle);
  }

  // Testing Faucet

  public addFundsTestnet(address: string, amount: number): Observable<any> {
    const data = {
      address: address,
      amount: amount,
    };
    console.log(data);
    return this.http.post(TESTING_URL + '/faucet?token=' + TOKEN, JSON.stringify(data))
    .map((res: Response) => {
      console.log(res.json());
      return res.json();
    })
    .catch(this.handleError);
  }

  // Send Paymentys

  public sendPayment(address: string, amount: number, wallet: Wallet): Observable<any> {
    const data = {
      inputs: [{
        wallet_name: wallet.name,
        wallet_token: wallet.token,
        }],
      outputs: [{
        addresses: [address],
        value: amount,
      }],
    };
    return this.http.post(TESTING_URL + '/txs/new/', JSON.stringify(data))
      .map((res) => {
        console.log(res.json());
        return res.json();
      })
      .catch(this.handleError);
  }

  // Error Handling for HTTP Errors
  private handleError(er) {
    console.log(er);
    if (er.title) {
      // Error already created
      return Observable.throw(er);
    } else {
      const error = new ErrorService(er.status);
      return Observable.throw(error);
    }
  }
}
