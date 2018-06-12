import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Headers, RequestOptions } from '@angular/http';
import { AppConstants } from '../../config/appConstants';

const URL = AppConstants.AUTH_SERVER_URL;

@Injectable()

/*
Service for handling the requests to the 2FA Server. The URL is defined on the
AppConstants config file.
*/

export class TwoFactorAuthService {

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    // Creates the request of 2FA for the logged user

    public activate2FAU(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.authService.getIdToken()
            .then((token) => {
                const data = {
                    idToken: token,
                };
                console.log(data);
                this.http.post(URL + 'setup/enable', JSON.stringify(data))
                .subscribe((res) => {
                    console.log(res);
                    resolve(res);
                }, (error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    // Validates the token sent by the user

    public validate2FAU(token: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.authService.getIdToken()
            .then((id) => {
                const data = {
                    idToken: id,
                    otp: token,
                };
                this.http.post(URL + 'verify', JSON.stringify(data))
                .subscribe((res) => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
                // We redirect to the twoFactorAuth Service
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

     // Activates the 2FA for the logged user (need to have a pending 2FA request)

    public verify2FAU(token: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.authService.getIdToken()
            .then((id) => {
                const data = {
                    idToken: id,
                    otp: token,
                };
                // We redirect to the twoFactorAuth Service
                this.http.post(URL + 'setup/verify', JSON.stringify(data))
                .subscribe((res) => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    // Deactivates the 2FA for the logged user
    public deactivate2FAU(): Promise<any> {
        return new Promise ((resolve, reject) => {
            this.authService.getIdToken()
            .then((id) => {
                const data = {
                    idToken: id,
                };
                // We redirect to the twoFactorAuth Service
                this.http.post(URL + 'setup/deactivate', JSON.stringify(data))
                .subscribe((res) => {
                    resolve(res);
                }, (error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
}
