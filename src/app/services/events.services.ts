import { Transaction } from '../models/transaction';
import { Activity } from '../models/activity';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from './loader.service';
import { User } from '../models/user';
import { Address } from '../models/address';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Wallet } from '../models/wallet';
import { KeyService } from './key.service';
import { AppData } from '../app.data';
import { Events } from 'ionic-angular';
import { IEvent } from '../interfaces/IEvent';
import { AppConstants } from '../../config/appConstants';

// REST Service for getting data from APIs and the Database

// API Base URL for the Testnet
const URL = AppConstants.CRYPTO_API_URL;
const TESTING_URL = AppConstants.CRYPTO_API_SOCKET;
const TOKEN = AppConstants.CRYPTO_API_TOKEN;

/*
Service for handling the web sockets that can be created using the Blockcypher API
Currently is inactive due to the request limit established by the free BlockCypher plan
*/

@Injectable()

export class EventService {

  constructor(private http: Http, private events: Events) {

  }

  public createTXConfirmationEvent(walletName: string) {
      const walletEvent = this.createEvent(walletName);
      const ws = new WebSocket(this.getPath('tes'));
      ws.onmessage = ((event) => {
          // We get the Notificaction that a TX has been made
          this.events.publish('wallet:update', walletName);
      });
      ws.onopen = ((message) => {
        ws.send(JSON.stringify(walletEvent));
      });
  }

  public createEvent(wallet: string) {
    const subEvent: IEvent = {};
    subEvent.wallet_name = wallet;
    subEvent.event = 'confirmed-tx';
    subEvent.token = TOKEN;
    subEvent.confirmations = 1;
    return subEvent;
  }

  // Error Handling for HTTP Errors
  private handleError(er): Observable<any> {
    if (er.title) {
      return Observable.throw(er);
    } else {
      return Observable.throw('ERROR.unknown');
    }
  }

  private getPath(crypto: string): string {
    const path = AppData.restAPIPaths.filter((p) => {
      return p.crypto === crypto;
    }).pop().path;
    return TESTING_URL + path;
  }
}
