import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserInfo } from '../model/user-info';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../services/utility.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    siteKey: string;

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
        private utilityService: UtilityService
    ) {
        this.siteKey = '6Lf1eRsaAAAAAI2kp2cAzeokZgRTrFPHFRoYhg4-';
        this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required],
      });
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
        if (this.authService.getIsLoggedIn()) {
            this.router.navigate(['home/dashboard']);
        }
    }

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
      console.log( this.loginForm.value.username + " => " + this.loginForm.value.password);
        if (this.loginForm.invalid) {
            console.log("invalid login form");
            return;
        }
        this.authService
            .loggedIn(
                this.loginForm.value.username,
                this.loginForm.value.password
            )
            .subscribe((response) => {
                // console.log(JSON.stringify(response));
                if (response.status) {
                    var userInfo = new UserInfo(response);
                    this.authService.setIsLoggedIn(userInfo);
                    this.router.navigate(['home/dashboard']);
                } else {
                    this.utilityService.showToast(
                        response.message,
                        4000,
                        'red'
                    );
                }
            });
    }

    onReset() {
        this.loginForm.reset();
    }
}
