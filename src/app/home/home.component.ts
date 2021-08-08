import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { NoteCategory } from '../model/note-category';
import { NoteInfo } from '../model/note-info';
import { UtilityService } from '../services/utility.service';
import { NoteSearchCriteria } from '../model/note-search-criteria';
import { LoginResponse } from '../model/login-response'

declare const $: any;
declare const M: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    key: string = 'id';
    errorMessage: string = "";
    noteCategoeyList: Array<NoteCategory>;
    noteInfoList: Array<NoteInfo>;
    page: any = 1;
    count: any = 0;
    tableSize: any = 5;
    tableSizes = [5, 10, 20, 50];
    loggedInUserData: LoginResponse = new LoginResponse();
    noteInfoGroup: FormGroup;
    categoryGroup: FormGroup;

    constructor(
        private authService: AuthService,
        private utilityService: UtilityService,
        private noteService: NoteService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {
        this.noteCategoeyList = new Array;
        this.noteInfoList = new Array;
        this.noteInfoGroup = this.formBuilder.group({
            username: [this.loggedInUserData.username],
            category: ['', Validators.required],
            title: ['', Validators.required],
            content: ['', Validators.required],
        });
        this.categoryGroup = this.formBuilder.group({
            name: ['', Validators.required],
        });
        this.fetchNoteCategory();
    }

    loadScript() {
        $(document).ready(function () {
            $('.modal').modal();
            $('.collapsible').collapsible({
                accordion: true,
            });
        });
    }

    onTableDataChange(page: any) {
        this.page = page;
        this.fetchNoteCategory();
    }

    onTableSizeChange(tableSize: any): void {
        this.tableSize = tableSize;
        this.page = 1;
        this.fetchNoteCategory();
    }

    onSubmitNoteCategory() {
        console.log(this.categoryGroup.value);
        this.noteService
            .saveNoteCategory(this.categoryGroup.value)
            .subscribe(
                (response) => {
                    if (response.success) {
                        this.utilityService.showToast(
                            response.message,
                            4000,
                            'green'
                        );
                        this.reloadCurrentRoute();
                    } else {
                        this.utilityService.showToast(
                            response.message,
                            4000,
                            'orange'
                        );
                    }
                },
                (err) => {
                    this.utilityService.showToast(
                        'Internal Server Error!',
                        4000,
                        'red'
                    );
                    console.group(err);
                }
            );
    }

    onSubmitNoteInfo() {
        console.log(this.noteInfoGroup.value);
        this.noteService
            .saveNoteINfo(this.noteInfoGroup.value)
            .subscribe(
                (response) => {
                    if (response.success) {
                        this.utilityService.showToast(
                            response.message,
                            4000,
                            'green'
                        );
                        this.reloadCurrentRoute();
                    } else {
                        this.utilityService.showToast(
                            response.message,
                            4000,
                            'orange'
                        );
                    }
                },
                (err) => {
                    this.utilityService.showToast(
                        'Internal Server Error!',
                        4000,
                        'red'
                    );
                    console.group(err);
                }
            );
    }

    fetchNoteCategory() {
        let request = new NoteCategory();

        this.noteService.searchNoteCategory(request).subscribe(
            (response) => {
                console.log("categoryList" + JSON.stringify(response));
                if (response.success) {
                    this.errorMessage = '';
                    this.noteCategoeyList = response.categoryList;
                    this.count = response.total;
                } else {
                    this.errorMessage = response.message;
                }
            },
            (exception) => {
                console.log(exception);
                this.utilityService.showToast(
                    exception.statusText,
                    3000,
                    'red'
                );
            }
        );
    }

    fetchNoteInfo() {
        let request = new NoteSearchCriteria();

        this.noteService.searchNoteInfo(request).subscribe(
            (response) => {
                console.log("noteInfoList :" + JSON.stringify(response));
                if (response.success) {
                    this.errorMessage = '';
                    this.noteInfoList = response.noteInfoList;
                    this.count = response.total;
                } else {
                    this.errorMessage = response.message;
                }
            },
            (exception) => {
                console.log(exception);
                this.utilityService.showToast(
                    exception.statusText,
                    3000,
                    'red'
                );
            }
        );
    }

    logout = () => {
        this.authService.logout();
    };

    ngOnInit(): void {
        var userData = this.authService.getUserDetails();
        // console.log(JSON.stringify(userData));
        if (userData != null) {
            this.loggedInUserData = JSON.parse(
                userData);
        }
        this.loadScript();
    }

    get f() {
        return null;
    }

    navigateToHome() {
        this.router.navigate(['home/dashboard']);
      }

      reloadCurrentRoute() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([currentUrl]);
        });
    }

}
