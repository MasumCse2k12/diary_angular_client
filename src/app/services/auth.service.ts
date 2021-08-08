import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../model/login-response';
import { UserInfo } from '../model/user-info';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UtilityService } from './utility.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    setIsLoggedIn(user: UserInfo) {
        sessionStorage.setItem('loggedIn', JSON.stringify(user));
    }

    getIsLoggedIn() {
        if (sessionStorage.getItem('loggedIn')) {
            return true;
        }
        return false;
    }

    constructor(
        private http: HttpClient,
        private router: Router,
        private utilityService: UtilityService
    ) {}

    loggedIn = (username: string, password: string) => {
        return this.http
            .post<LoginResponse>( environment.diaryapi + '/diaryapi/auth/login', {
                username: username,
                password: password,
            })
            .pipe(
                catchError((error) => {
                    console.log("error : " + error.message);
                    this.utilityService.showToast(
                        "Internal Service Error. Please try again later!",
                        4000,
                        'red'
                    );
                    return throwError(error.message);
                })
            );
    };

    getUserDetails() {
        return sessionStorage.getItem('loggedIn') || null;
    }

    logout = () => {
        sessionStorage.removeItem('loggedIn');
        this.router.navigate(['login']);
    };
}
