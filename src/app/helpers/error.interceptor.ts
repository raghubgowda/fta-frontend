import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
            if (!err.url?.includes('generate-token') && err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }
            return throwError(this.extractMessage(err));
        }));
    }

    // API errors may be a string, an object with a message, or empty (network/CORS failures)
    private extractMessage(err: HttpErrorResponse): string {
        if (typeof err.error === 'string' && err.error) {
            return err.error;
        }
        return err.error?.message || err.statusText || 'Unexpected error, please try again';
    }
}