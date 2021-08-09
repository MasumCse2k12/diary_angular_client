import { Component, OnInit } from '@angular/core';
import { NoteSearchCriteria } from '../model/note-search-criteria';
import { NoteService } from '../services/note.service';
import { UtilityService } from '../services/utility.service';
import { NoteInfo } from '../model/note-info';

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

  constructor(private utilityService: UtilityService, private noteService: NoteService) {
    this.noteInfoList = new Array;
    this.fetchNoteInfo();
  }

  ngOnInit(): void {
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
          }else{
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

  editNote(noteId: number) {
    console.log('Edit note id : ' + noteId);
    this.underConstruction();
  }

  deleteNote(noteId: number) {
    console.log('Delete note id : ' + noteId);
    this.underConstruction();
  }

  underConstruction() {
    this.utilityService.showToast(
      "servie completed but not implemented from clietn side now",
      3000,
      'orange'
    );
  }

}
