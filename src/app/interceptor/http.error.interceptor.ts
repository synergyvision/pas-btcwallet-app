import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const BlockCypher = 'blockcypher';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    return next.handle(request)
      .catch((response) => {
        if (response instanceof HttpErrorResponse) {
          return Observable.throw(this.handleError(response, request.url));
        }
        return Observable.throw('ERROR.unknown');
      });
  }

  public handleError(response: HttpErrorResponse, url: string): string {
    console.log(response);
    console.log(url);
    if (url.search(BlockCypher) !== -1) {
      return this.blockCypherError(response);
    } else if (url.search('twofactor') !== -1) {
      return response.error;
    }
  }

  public blockCypherError(error: HttpErrorResponse): string {
      // HTTP Error Handler for BlockCypher
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
