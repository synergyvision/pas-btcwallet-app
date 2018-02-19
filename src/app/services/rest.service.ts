import { Transaction } from '../models/transaction';
import { Activity } from '../models/activity';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from './loader.service';
import { IAddress } from '../models/IAddress';
import { User } from '../models/user';
import { Address } from '../models/address';
import { IBlockchain } from '../models/IBlockchain';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Wallet } from '../models/wallet';
import { IBalance } from '../models/IBalance';
import { ErrorService } from './error.service';
import { KeyService } from './key.service';
import { IHDWallet } from '../models/IHDWallet';
import { ITransaction, ITransactionSke } from '../models/ITransaction';
import { IHDChain } from '../models/IHDChain';

// REST Service for getting data from APIs and the Database

// API Base URL for the Testnet
const URL = 'https://api.blockcypher.com/v1/btc/main';
const TESTING_URL = 'https://api.blockcypher.com/v1/btc/test3';
const TOKEN = '6947d4107df14da5899cb2f87a9bb254';
const TOKEN2 = '5b3df9346d0e4eac88bc17e6cfb636a6';

@Injectable()

export class RestService {

  public blockChain: IBlockchain;
  public activityList: Activity[];
  public transactionList: Transaction[];
  public walletFunds: number;
  private options: RequestOptions;

  constructor(private http: Http, private loadService: LoaderService, private alertService: AlertService,
              private databaseProvider: FirebaseProvider, private keyService: KeyService) {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    this.options = new RequestOptions( {method: RequestMethod.Post, headers: headers });
    this.activityList = [
      new Activity(1, '12/12/2017', 'Acceso desde dispositivo Android NG-7800'),
      new Activity(2, '06/11/2017', 'Cambio de clave'),
      new Activity(3, '05/04/2017', 'Se agregaron 00,156 BTC a la billetera'),
      new Activity(4, '28/03/2017', 'Se agregaron 00,23 BTC a la billetera'),
      new Activity(5, '14/01/2017', 'Cambio de clave'),
      new Activity(6, '28/12/2016', 'Acceso desde dispositivo iPhone 6c'),
    ];
  }

  // Create an HD Wallet
  public createWalletHD(data): Observable<IHDWallet> {
     return this.http.post(TESTING_URL + '/wallets/hd?token=' + TOKEN, JSON.stringify(data), this.options)
     .map((res: Response) => {
       return res.json() as IHDWallet;
     }).catch(this.handleError);
  }

  public getWalletAddresses(wallet: Wallet): Observable<any> {
    return this.http.get(TESTING_URL + '/wallets/hd/' + wallet.name + '/addresses?token=' + TOKEN)
    .map((res: Response) => {
      return res.json();
    }).catch(this.handleError);
  }

  // Derive an address from an HD Wallet
  public deriveAddress(wallet: Wallet): Observable<IHDWallet> {
    return this.http.post(TESTING_URL + '/wallets/hd/' + wallet.name + '/addresses/derive?token=' + TOKEN,
    {} , this.options)
      .map((res: Response) => {
        const address = res.json() as IHDWallet;
        return address.chains[0].chain_addresses.pop().address;
      }).catch(this.handleError);
  }

  // Gets a Wallet Balance
  public getBalanceFromWallet(wallet: Wallet): Observable<IBalance> {
    return this.http.get(TESTING_URL + '/addrs/' + wallet.name + '/balance?token=' + TOKEN)
    .map((res: Response) => {
      const balance = res.json() as IBalance;
      balance.crypto = wallet.crypto;
      return balance;
    })
    .catch(this.handleError);
  }

  public getWalletTransactions(wallet: Wallet): Observable<IAddress> {
    return this.http.get(TESTING_URL + '/addrs/' + wallet.name + '/full?token=' + TOKEN)
    .map((res: Response) => {
      const transactions = res.json() as IAddress;
      transactions.crypto = wallet.crypto;
      return transactions;
    })
    .catch(this.handleError);
  }

  public getUnusedAddressesWallet(wallet: IHDWallet): Observable<any> {
    if ((wallet.addresses) && (wallet.addresses.length > 0)) {
      return this.getAddressBalance(wallet.addresses.pop())
      .first()
      .map((balance) => {
        if (balance.n_tx === 0) {
          return balance.address;
        } else {
          return this.deriveAddress(wallet);
        }
      })
      .catch(this.handleError);
    } else {
      return this.deriveAddress(wallet);
    }
  }

  // Gets an Address Balance
  public getAddressBalance(address: string) {
    return this.http.get(TESTING_URL + '/addrs/' + address + '/balance')
    .map((res: Response) => {
      return res.json() as IAddress;
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
    return this.http.post(TESTING_URL + '/faucet?token=' + TOKEN, JSON.stringify(data))
    .map((res: Response) => {
      return res.json();
    })
    .catch(this.handleError);
  }

  // Send Paymentys

  public createPayment(address: string, amount: number, wallet: Wallet): Observable<ITransactionSke> {
    console.log(address);
    const data = JSON.stringify({
      inputs: [{
        wallet_name: wallet.name,
        wallet_token: TOKEN,
        }],
      outputs: [{
        addresses: [
          address,
        ],
        value: Number(amount),
      }],
    });
    return this.http.post(TESTING_URL + '/txs/new?token=' + TOKEN, data)
      .map((res) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  public sendPayment(trx: ITransactionSke): Observable<ITransactionSke> {
    return this.http.post(TESTING_URL + '/txs/send', JSON.stringify(trx))
    .map((res: Response) => {
      return res.json() as ITransactionSke;
    })
    .catch(this.handleError);
  }

  // Error Handling for HTTP Errors
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
