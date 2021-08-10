import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteSearchCriteria } from '../model/note-search-criteria';
import { NoteService } from '../services/note.service';
import { UtilityService } from '../services/utility.service';
import { NoteInfo } from '../model/note-info';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteCategory } from '../model/note-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  categoryId: number = 0;
  noteInfoList: Array<NoteInfo>;
  page: any = 1;
  count: any = 0;
  tableSize: any = 5;
  tableSizes = [5, 10, 20, 50];
  key: string = 'id';
  errorMessage: string = "";
  noteInfoGroup: FormGroup;
  noteCategoeyList: Array<NoteCategory>;

  constructor(private _Activatedroute: ActivatedRoute, private utilityService: UtilityService, private noteService: NoteService, private formBuilder: FormBuilder, private router: Router) {
    var categoryId = this._Activatedroute.snapshot.paramMap.get("id");
    console.log("categoryId :" + categoryId);
    if (categoryId != null) {
      this.categoryId = Number(categoryId);
    }
    this.noteInfoList = new Array;
    this.noteCategoeyList = new Array;
    this.noteInfoGroup = this.formBuilder.group({
      id: [0],
      category: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this._Activatedroute.params.subscribe(routeParams => {
      console.log("CCCCCC ID : " + routeParams.id);
      this.fetchNoteInfo(routeParams.id);
    });
    this.fetchNoteCategory();
  }

  onTableDataChange(page: any) {
    this.page = page;
    this.fetchNoteInfo(0);
  }

  onTableSizeChange(tableSize: any): void {
    this.tableSize = tableSize;
    this.page = 1;
    this.fetchNoteInfo(0);
  }

  fetchNoteInfo(categoryId: number) {
    let request = new NoteSearchCriteria();
    request.category = categoryId;
    this.noteService.searchNoteInfo(request).subscribe(
      (response) => {
        console.log("noteInfoList :" + JSON.stringify(response));
        if (response.success) {
          this.errorMessage = '';
          if (response.total > 0) {
            this.noteInfoList = response.noteInfoList;
          } else {
            this.noteInfoList = new Array;
          }
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

  editNoteInfo(noteId: number) {
    console.log('Edit note id : ' + noteId);

    let request = new NoteSearchCriteria();
    request.noteId = noteId;
    this.noteService.searchNoteInfo(request).subscribe(
      (response) => {
        console.log("noteInfo by ID :" + JSON.stringify(response));
        if (response.success) {
          this.errorMessage = '';
          if (response.total > 0) {
            this.noteInfoGroup = this.formBuilder.group({
              id: [noteId],
              category: [response.noteInfoList[0].noteCategory.id],
              title: [response.noteInfoList[0].title],
              content: [response.noteInfoList[0].content],
            });
            console.log("noteInfoForm group : " + JSON.stringify(this.noteInfoGroup.value));
          }
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

    // this.underConstruction();
  }

  deleteNoteInfo(noteId: number) {
    console.log('Delete note id : ' + noteId);
    this.noteInfoGroup = this.formBuilder.group({
      id: [noteId]
    });
    // this.underConstruction();
  }


  underConstruction() {
    this.utilityService.showToast(
      "servie completed but not implemented from clietn side now",
      3000,
      'orange'
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

  onSubmitEditNoteInfo() {
    // console.log(JSON.stringify(this.noteInfoGroup.value));
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

  submitDeleteNoteInfo() {
    // console.log(JSON.stringify(this.noteInfoGroup.value));
    this.noteService
      .deleteNoteINfo(this.noteInfoGroup.value)
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

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
