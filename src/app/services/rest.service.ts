import { AlertService } from './alert.service';
import { Transaction } from '../models/transaction';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from './loader.service';
import { User } from '../models/user';
import { Address } from '../models/address';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Activity } from '../models/activity';
import { FormGroup } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Wallet } from '../models/wallet';
import { KeyService } from './key.service';
import { create } from 'domain';
import { AppData } from '../app.data';
import { IHDWallet } from '../interfaces/IHDWallet';
import { IBalance } from '../interfaces/IBalance';
import { IAddress } from '../interfaces/IAddress';
import { ITransactionSke } from '../interfaces/ITransactionSke';
import { IBlockchain } from '../interfaces/IBlockchain';
import { IBlock } from '../interfaces/IBlock';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// REST Service for getting data from BlockCypher API

// API Base URL for the Testnet
const URL = 'https://api.blockcypher.com/v1/';
const TOKEN = '6947d4107df14da5899cb2f87a9bb254';
const TOKEN2 = '5b3df9346d0e4eac88bc17e6cfb636a6';

@Injectable()

export class RestService {

  private options: RequestOptions;
  private CRYPTO: string;

  constructor(private http: HttpClient, private loadService: LoaderService, private keyService: KeyService) {
  }

  // Create an HD Wallet
  public createWalletHD(data, crypto: string): Observable<IHDWallet> {
    return this.http.post(this.getPath(crypto) + '/wallets/hd?token=' + TOKEN, JSON.stringify(data))
      .map((res) => {
        return res as IHDWallet;
      });
  }

  // Derive an address from an HD Wallet
  public deriveAddress(wallet: string, crypto: string): Observable<IHDWallet> {
    return this.http.post(this.getPath(crypto) + '/wallets/hd/' + wallet + '/addresses/derive?token=' + TOKEN,
      {})
      .map((res) => {
        const address = res as IHDWallet;
        return address.chains[0].chain_addresses.pop().address;
      });
  }

  // Gets a Wallet Balance
  public getBalanceFromWallet(wallet: Wallet): Observable<IBalance> {
    return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.name + '/balance?token=' + TOKEN)
      .map((res) => {
        const balance = res as IBalance;
        balance.wallet.crypto = wallet.crypto;
        balance.wallet.multiSignedKey = wallet.multiSignedKey;
        return balance;
      });
  }

  // Gets an Address Balance

  public getAddressBalance( address: string, crypto: string): Observable<IAddress> {
    return this.http.get(this.getPath(crypto) + '/addrs/' + address + '/balance')
      .map((res) => {
        return res as IAddress;
      });
  }

  public getAddressWalletBalance(wallet: Wallet): Observable<IAddress> {
    return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.address + '/balance')
      .map((res) => {
        const balance = res as IAddress;
        balance.wallet = wallet;
        return balance;
      });
  }

  // Gets every Wallet Transaction

  public getWalletTransactions(wallet: Wallet): Observable<IAddress> {
    if (wallet.crypto.value === 'bet' || wallet.crypto.value === 'tet') {
      return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + wallet.address)
      .map((res) => {
        const transactions = res as IAddress;
        transactions.crypto = wallet.crypto;
        transactions.txs = transactions.txrefs;
        return transactions;
      });
    } else {
      let path = wallet.name + '/full?token=' + TOKEN;
      if (wallet.address !== '') {
        path = wallet.address + '/full';
      }
      return this.http.get(this.getPath(wallet.crypto.value) + '/addrs/' + path)
        .map((res) => {
          const transactions = res as IAddress;
          transactions.crypto = wallet.crypto;
          return transactions;
      });
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
        });
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
        // We get the Transaction to be Signed
        return res as ITransactionSke;
      });
  }

  // Sends a signed payment

  public sendPayment(trx: ITransactionSke, crypto: string): Observable<ITransactionSke> {
    console.log(trx);
    return this.http.post(this.getPath(crypto) + '/txs/send?token=' + TOKEN, JSON.stringify(trx))
      .map((res) => {
        return res as ITransactionSke;
      });
  }

  // Puts Metada on a TX

  public putMetadata(trx: string, crypto: string, data: any ): Observable<any> {
    return this.http.put(this.getPath(crypto) + '/txs/' + trx + '/meta?token=' + TOKEN + '&private=true', data)
    .map((res) => {
      return res;
    });
  }

  public getMetadata(trx: string, crypto: string) {
    return this.http.get(this.getPath(crypto) + '/txs/' + trx + '/meta?token=' + TOKEN + '&private=true')
    .map((res) => {
      console.log(res);
      return res;
    });
  }

  // Testing Faucet

  public addFundsTestnet(address: string, amount: number, crypto: string): Observable<any> {
    this.CRYPTO = this.getPath(crypto);
    const data = {
      address: address,
      amount: amount,
    };
    return this.http.post(this.getPath(crypto) + '/faucet?token=' + TOKEN, JSON.stringify(data))
      .map((res) => {
        return res;
      });
  }

  // BlockChain Explorer

  public getBlockChain(crypto: string): Observable<IBlockchain> {
    return this.http.get(this.getPath(crypto))
      .map((res) => {
        return res as IBlockchain;
      });
  }

  public getBlock(hash: string, crypto: string): Observable<IBlock> {
    return this.http.get(this.getPath(crypto) + '/blocks/' + hash)
      .map((res) => {
        return res as IBlock;
      });
  }

  // MultiSigned Wallet Methods

  public createMultiSignedAddress(crypto: string, keys: string[], script: string)
  : Observable<IAddress> {
    const data = JSON.stringify({
      pubkeys: keys,
      script_type: script,
    });
    return this.http.post(this.getPath(crypto) + '/addrs?token=' + TOKEN, data)
    .map((res) => {
      return res as IAddress;
    });
  }

  private getPath(crypto: string): string {
    const path = AppData.restAPIPaths.filter((p) => {
      return p.crypto === crypto;
    }).pop().path;
    return URL + path;
  }
}
