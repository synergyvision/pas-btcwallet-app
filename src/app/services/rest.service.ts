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
import { create } from 'domain';
import { AppData } from '../app.data';

// REST Service for getting data from BlockCypher API

// API Base URL for the Testnet
const URL = 'https://api.blockcypher.com/v1/';
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
        balance.wallet.multiSignedKey = wallet.multiSignedKey;
        return balance;
      })
      .catch(this.handleError);
  }

  // Gets an Address Balance

  public getAddressBalance( address: string, crypto: string): Observable<IAddress> {
    return this.http.get(this.getPath(crypto) + '/addrs/' + address + '/balance')
      .map((res: Response) => {
        return res.json() as IAddress;
      })
      .catch(this.handleError);
  }

  public getAddressWalletBalance(wallet: Wallet): Observable<IAddress> {
    return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.address + '/balance')
      .map((res: Response) => {
        const balance = res.json() as IAddress;
        balance.wallet = wallet;
        return balance;
      })
      .catch(this.handleError);
  }

  // Gets every Wallet Transaction

  public getWalletTransactions(wallet: Wallet): Observable<IAddress> {
    if (wallet.crypto.value === 'bet' || wallet.crypto.value === 'tet') {
      return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.address)
      .map((res: Response) => {
        const transactions = res.json() as IAddress;
        transactions.crypto = wallet.crypto;
        transactions.txs = transactions.txrefs;
        return transactions;
      })
      .catch(this.handleError);
    } else {
      let path = wallet.name + '/full?token=' + TOKEN;
      if (wallet.address !== '') {
        path = wallet.address + '/full';
      }
      return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + path)
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

  public createPayment(data: any, crypto: string): Observable<ITransactionSke> {
    console.log('we create the transaction with this input');
    console.log(data);
    return this.http.post(this.getPath(crypto) + '/txs/new?token=' + TOKEN, data)
      .map((res) => {
        console.log('We get the Transaction to be Signed');
        console.log(res.json() as ITransactionSke);
        return res.json() as ITransactionSke;
      })
      .catch(this.handleError);
  }

  // Sends a signed payment

  public sendPayment(trx: ITransactionSke, crypto: string): Observable<ITransactionSke> {
    console.log(trx);
    return this.http.post(this.getPath(crypto) + '/txs/send?token=' + TOKEN, JSON.stringify(trx))
      .map((res: Response) => {
        console.log(res.json());
        return res.json() as ITransactionSke;
      })
      .catch(this.handleError);
  }

  // Puts Metada on a TX

  public putMetadata(trx: string, crypto: string, data: any ): Observable<any> {
    return this.http.put(this.getPath(crypto) + '/txs/' + trx + '/meta?token=' + TOKEN, data)
    .map((res: Response) => {
      console.log(res.json());
      return res.json();
    })
    .catch(this.handleError);
  }

  public getMetadata(trx: string, crypto: string) {
    return this.http.get(this.getPath(crypto) + '/txs/' + trx + '/meta?token=' + TOKEN + '&private=true')
    .map((res: Response) => {
      console.log(res.json());
      return res.json();
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

  // MultiSigned Wallet Methods

  public createMultiSignedAddress(crypto: string, keys: string[], script: string)
  : Observable<IAddress> {
    const data = JSON.stringify({
      pubkeys: keys,
      script_type: script,
    });
    return this.http.post(this.getPath(crypto) + '/addrs?token=' + TOKEN, data)
    .map((res: Response) => {
      console.log(res);
      return res.json() as IAddress;
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
    return URL + path;
  }
}
