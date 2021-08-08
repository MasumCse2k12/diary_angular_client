import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        var userData = this.authService.getUserDetails();
        // console.log("base req " + JSON.stringify(req));
        // console.log("user Data : " + userData);

        if (userData != null) {
            const loggedInUserData = JSON.parse(userData);
            // console.log("user loggedInUserData : " + loggedInUserData.accessToken);
                const clonedRequest = req.clone({
                    headers: req.headers.set(
                        'Authorization',
                        'Bearer ' + loggedInUserData.accessToken
                    ),
                });
                return next.handle(clonedRequest);
        } else {
            // console.log("base req " + req);
            return next.handle(req);
        }
    }
}
