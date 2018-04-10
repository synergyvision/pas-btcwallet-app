import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Headers, RequestOptions } from '@angular/http';

const URL =  'http://localhost:3000/twofactor/';

@Injectable()

export class TwoFactorAuthService {

    constructor(private http: HttpClient) {
    }

    public active2FAU(id: string, token: string): Observable<any> {
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
}
