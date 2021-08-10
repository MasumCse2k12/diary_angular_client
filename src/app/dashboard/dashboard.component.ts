import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { NoteSearchCriteria } from '../model/note-search-criteria';
import { NoteService } from '../services/note.service';
import { UtilityService } from '../services/utility.service';
import { NoteInfo } from '../model/note-info';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteCategory } from '../model/note-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  noteInfoList: Array<NoteInfo>;
  page: any = 1;
  count: any = 0;
  tableSize: any = 5;
  tableSizes = [5, 10, 20, 50];
  key: string = 'id';
  errorMessage: string = "";
  noteInfoGroup: FormGroup;
  noteCategoeyList: Array<NoteCategory>;

  @Output() getNoteById:EventEmitter<any> = new EventEmitter();

  constructor(private utilityService: UtilityService, private noteService: NoteService, private formBuilder: FormBuilder,  private router: Router) {
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
    this.fetchNoteCategory();
    this.fetchNoteInfo();
  }


  onTableDataChange(page: any) {
    this.page = page;
    this.fetchNoteInfo();
  }

  onTableSizeChange(tableSize: any): void {
    this.tableSize = tableSize;
    this.page = 1;
    this.fetchNoteInfo();
  }

  fetchNoteInfo() {
    let request = new NoteSearchCriteria();

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
            this.getNoteById.emit(this.noteInfoGroup);
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
