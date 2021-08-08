import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NoteCategory } from '../model/note-category';
import { NoteCategoryResponse } from '../model/NoteCategoryResponse';
import { NoteSearchCriteria } from '../model/note-search-criteria';
import { NoteInfoResponse } from '../model/NoteInfoResponse';
import { ApiResponse } from '../model/ApiResponse';
import { NoteInfo } from '../model/note-info';

@Injectable({
  providedIn: 'root',
})
export class NoteService {

  private val: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    var userData = sessionStorage.getItem('loggedIn');
    if (userData != null) {
      this.val = 'Bearer ' + JSON.parse(userData).accessToken;
    } else {
      this.val = "";
    }

    // this.val = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzaGFraWwiLCJpYXQiOjE2MTE3MzQ0MDgsImV4cCI6MTYxMTgyMDgwOH0.SfZtTBAW29oXqizDLVKMviwMSSRUVrTfO8UMCycLt6OIH1oRoQiWvfv72XVm5akLORVwOXAW6sV_t97n8xoVtA';
  }


  searchNoteCategory(request: NoteCategory) {
    // console.log("Bearer : " + this.val);
    return this.http.post<NoteCategoryResponse>(environment.diaryapi + '/diaryapi/note/category/list', request, {
      headers: new HttpHeaders({ 'Authorization': this.val })
    }).pipe(catchError(error => {
      console.log("api call error " + error.message);
      return throwError(error.message);
    }));
  }

  searchNoteInfo(request: NoteSearchCriteria) {
    return this.http.post<NoteInfoResponse>(environment.diaryapi + '/diaryapi/note/list', request, {
      headers: new HttpHeaders({ 'Authorization': this.val })
    }).pipe(catchError(error => {
      return throwError(error.message);
    }));
  }

  saveNoteCategory(request: NoteCategory) {
    // console.log(JSON.parse(request));
    return this.http
      .post<ApiResponse>(environment.diaryapi + '/diaryapi/note/category/submit', request)
      .pipe(
        catchError((error) => {
          return throwError(error.message);
        })
      );
  }

  saveNoteINfo(request: any) {
    // console.log(JSON.parse(request));
    return this.http
      .post<ApiResponse>(environment.diaryapi + '/diaryapi/note/info/submit', request)
      .pipe(
        catchError((error) => {
          return throwError(error.message);
        })
      );
  }
}
