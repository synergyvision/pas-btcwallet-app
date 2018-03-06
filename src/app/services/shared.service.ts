import { Injectable } from '@angular/core';
import { IBalance } from '../models/IBalance';
import { User } from 'firebase/app';
import { Wallet } from '../models/wallet';

@Injectable()

export class SharedService {
    public balance: IBalance[];
    public user: User;
    public wallets: Wallet[];
    
    constructor(){

    }

    public setUser(user: User) {
        this.user = user;
    }

    public setWallets(wallets: Wallet[]) {
        this.wallets = wallets;
    }
}