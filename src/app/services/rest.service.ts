import { AlertService } from './alert.service';
import { Transaction } from '../models/transaction';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from './loader.service';
import { IAddress } from '../models/IAddress';
import { User } from '../models/user';
import { Address } from '../models/address';
import { IBlock, IBlockchain } from '../models/IBlockchain';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Activity } from '../models/activity';
import { FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Wallet } from '../models/wallet';
import { IBalance } from '../models/IBalance';
import { ErrorService } from './error.service';
import { KeyService } from './key.service';
import { IHDWallet } from '../models/IHDWallet';
import { ITransaction, ITransactionSke } from '../models/ITransaction';
import { IHDChain } from '../models/IHDChain';
import { AppData } from '../app.data';
import { create } from 'domain';

// REST Service for getting data from BlockCypher API

// API Base URL for the Testnet
const URL = 'https://api.blockcypher.com/v1/';
const TESTING_URL = 'https://api.blockcypher.com/v1/';
const TOKEN = '6947d4107df14da5899cb2f87a9bb254';
const TOKEN2 = '5b3df9346d0e4eac88bc17e6cfb636a6';

@Injectable()

export class RestService {

  private options: RequestOptions;
  private CRYPTO: string;

  constructor(private http: Http, private loadService: LoaderService, private keyService: KeyService) {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    this.options = new RequestOptions({ method: RequestMethod.Post, headers: headers });
  }

  // Create an HD Wallet
  public createWalletHD(data, crypto: string): Observable<IHDWallet> {
    return this.http.post(this.getPath(crypto) + '/wallets/hd?token=' + TOKEN, JSON.stringify(data), this.options)
      .map((res: Response) => {
        return res.json() as IHDWallet;
      }).catch(this.handleError);
  }

  public createAddress(crypto: string): Observable<any> {
    return this.http.post(this.getPath(crypto) + '/addrs?token=' + TOKEN, undefined)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  // Derive an address from an HD Wallet
  public deriveAddress(wallet: string, crypto: string): Observable<IHDWallet> {
    return this.http.post(this.getPath(crypto) + '/wallets/hd/' + wallet + '/addresses/derive?token=' + TOKEN,
      {}, this.options)
      .map((res: Response) => {
        const address = res.json() as IHDWallet;
        return address.chains[0].chain_addresses.pop().address;
      }).catch(this.handleError);
  }

  // Gets a Wallet Balance
  public getBalanceFromWallet(wallet: Wallet): Observable<IBalance> {
    return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.name + '/balance?token=' + TOKEN)
      .map((res: Response) => {
        const balance = res.json() as IBalance;
        balance.wallet.crypto = wallet.crypto;
        return balance;
      })
      .catch(this.handleError);
  }

  // Gets an Address Balance

  public getEthereumBalance(wallet: Wallet): Observable<IAddress> {
    return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.address + '/balance')
      .map((res: Response) => {
        const balance = res.json() as IAddress;
        balance.wallet = wallet;
        return balance;
      })
      .catch(this.handleError);
  }

  public getAddressBalance(address: string, crypto: string): Observable<IAddress> {
    return this.http.get(this.getPath(crypto) + '/addrs/' + address + '/balance')
      .map((res: Response) => {
        return res.json() as IAddress;
      })
      .catch(this.handleError);
  }

  // Gets every Wallet Transaction

  public getWalletTransactions(wallet: Wallet): Observable<IAddress> {
    console.log(wallet);
    if (wallet.crypto.value === 'eth' || wallet.crypto.value === 'tet') {
      return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.address)
      .map((res: Response) => {
        const transactions = res.json() as IAddress;
        transactions.crypto = wallet.crypto;
        return transactions;
      })
      .catch(this.handleError);
    } else {
    return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.name + '/full?token=' + TOKEN)
      .map((res: Response) => {
        const transactions = res.json() as IAddress;
        transactions.crypto = wallet.crypto;
        return transactions;
      })
      .catch(this.handleError);
    }
  }

  // Returns an unused address from a Wallet for pseudo anonymous transactions

  public getUnusedAddressesWallet(wallet: IHDWallet): Observable<any> {
    if ((wallet.addresses) && (wallet.addresses.length > 0)) {
      return this.getAddressBalance(wallet.addresses.pop(), wallet.crypto.value)
        .first()
        .flatMap((balance) => {
          if (balance.n_tx === 0) {
            return Observable.of(balance.address);
          } else {
            return this.deriveAddress(wallet.name, wallet.crypto.value);
          }
        })
        .catch(this.handleError);
    } else {
      return this.deriveAddress(wallet.name, wallet.crypto.value);
    }
  }

  // Creates a Transaction Skeleton to be signed

  public createPayment(address: string, amount: number, wallet: Wallet): Observable<ITransactionSke> {
    let data: {};
    if (wallet.crypto.value === 'eth' || wallet.crypto.value === 'tet') {
      data = JSON.stringify({
        inputs: [{
          addresses: [
            wallet.address,
          ],
        }],
        outputs: [{
          addresses: [
            address,
          ],
          value: Number(amount),
        }],
      });

    } else {
      data = JSON.stringify({
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
    }
    return this.http.post(this.getPath(wallet.crypto.value) + '/txs/new?token=' + TOKEN, data)
      .map((res) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  // Sends a signed payment

  public sendPayment(trx: ITransactionSke, crypto: string): Observable<ITransactionSke> {
    return this.http.post(this.getPath(crypto) + '/txs/send?token=' + TOKEN, JSON.stringify(trx))
      .map((res: Response) => {
        return res.json() as ITransactionSke;
      })
      .catch(this.handleError);
  }

  // Testing Faucet

  public addFundsTestnet(address: string, amount: number, crypto: string): Observable<any> {
    this.CRYPTO = this.getPath(crypto);
    const data = {
      address: address,
      amount: amount,
    };
    return this.http.post(this.getPath(crypto) + '/faucet?token=' + TOKEN, JSON.stringify(data))
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  // BlockChain Explorer

  public getBlockChain(crypto: string): Observable<IBlockchain> {
    return this.http.get(this.getPath(crypto))
      .map((res: Response) => {
        return res.json() as IBlockchain;
      })
      .catch(this.handleError);
  }

  public getBlock(hash: string, crypto: string): Observable<IBlock> {
    return this.http.get(this.getPath(crypto) + '/blocks/' + hash)
      .map((res: Response) => {
        return res.json() as IBlockchain;
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

  private getPath(crypto: string): string {
    const path = AppData.restAPIPaths.filter((p) => {
      return p.crypto === crypto;
    }).pop().path;
    return TESTING_URL + path;
  }
}
