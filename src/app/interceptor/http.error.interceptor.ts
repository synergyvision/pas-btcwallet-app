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
    return next.handle(request)
      .catch((response) => {
        if (response instanceof HttpErrorResponse) {
          console.log('Processing http error', response);
          return Observable.throw(this.handleError(response, request.url));
        }
        return Observable.throw('ERROR.unknown');
      });
  }

  public handleError(response: HttpErrorResponse, url: string): string {
    if (url.search(BlockCypher) !== -1) {
      return this.blockCypherError(response);
    } else {
      return 'ERROR.unknown';
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
