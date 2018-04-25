import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const BlockCypher = 'blockcypher';

// Interceptor for handling the API Errors

// This Interceptor catches errors sent by the APIs, and handles them accordingly.

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  // Defines the Interceptor

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    return next.handle(request)
      .catch((response) => {
        if (response instanceof HttpErrorResponse) {
          // We return the result of handling the error
          return Observable.throw(this.handleError(response, request.url));
        }
        return Observable.throw('ERROR.unknown');
      });
  }

  public handleError(response: HttpErrorResponse, url: string): string {
    // We define the APIS and their respective function for handling errors
    if (url.search(BlockCypher) !== -1) {
      return this.blockCypherError(response);
    } else if (url.search('twofactor') !== -1) {
      return this.twoFactorError(response);
    }
  }

  // Handler for the 2FA Errors
  public twoFactorError(error): string {
    console.log(error);
    if ( error.statusText === 'Unknown Error') {
      return 'ERROR.connection_message';
    } else {
      return error.error;
    }

  }

  // Handler for the Blockcypher Errors
  public blockCypherError(error: HttpErrorResponse): string {
      // Connection Error
      if (error.status === 0) {
          return 'ERROR.connection_message';
      }
      // Too many Requests
      if (error.status === 429) {
          return 'ERROR.connection_message';

      } else {
          return 'ERROR.unknown';
      }
      /* if (error.status === 409) {
          if (error.statusText.error === 'Error: wallet exists') {
              this.message = 'WALLET_DUPLICATE';
          }
      } */
  }
}
