import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Headers, RequestOptions } from '@angular/http';

const URL =  'http://172.16.16.232:3000/twofactor/';

@Injectable()

export class TwoFactorAuthService {

    constructor(private http: HttpClient) {
    }

    public active2FAU(token: string): Observable<any> {
        const data = {
            idToken: token,
        };
        console.log(data);
        return this.http.post(URL + 'setup/enable', JSON.stringify(data))
        .map((res) => {
            console.log(res);
            return res;
        });
    }

    public validateToken(id: string, token: number): Observable<any> {
        const data = {
            idToken: id,
            otp: token,
        };
        return this.http.post(URL + 'verify', JSON.stringify(data))
        .map((res) => {
            console.log(res);
            return res;
        });
    }

    public verifySecret(id: string, token: number): Observable<any> {
        const data = {
            idToken: id,
            otp: token,
        };
        return this.http.post(URL + 'setup/verify', JSON.stringify(data))
        .map((res) => {
            return res;
        });
    }

    public deactivate2FA(id: string): Observable<any> {
        const data = {
            idToken: id,
        };
        return this.http.post(URL + 'setup/deactivate', JSON.stringify(data))
        .map((res) => {
            console.log(res);
            return res;
        });
    }
}
