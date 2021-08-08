import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const M: any;

@Injectable({
    providedIn: 'root',
})
export class UtilityService {

    constructor(private http: HttpClient) {}

    showToast = (message : string, timeout: number, classes : string) => {
        M.toast({ html: message, displayLength: timeout, classes: classes });
    };


}
