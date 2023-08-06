import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwtToken = this.authService.getJwtToken();

        if (!jwtToken) {
            return next.handle(req);
        }

        const requestWithHeader = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
        });

        return next.handle(requestWithHeader).pipe(
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse
                    && !req.url.includes('/auth')
                    && error.status === 401
                ) {
                    return this.handleExpiredJwt(req, next);
                }

                return throwError(() => error);
            })
        );
    }

    private handleExpiredJwt(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;

            return this.authService.refreshToken().pipe(
                switchMap(() => {
                    this.isRefreshing = false;

                    return next.handle(request);
                }),
                catchError((error) => {
                    this.isRefreshing = false;

                    if (error.status == '403') {
                        // delete local storage and do a full log out
                        localStorage.clear();
                    }

                    return throwError(() => error);
                })
            );
        }

        return next.handle(request);
    }

}