import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteSearchCriteria } from '../model/note-search-criteria';
import { NoteService } from '../services/note.service';
import { UtilityService } from '../services/utility.service';
import { NoteInfo } from '../model/note-info';

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
  constructor(private _Activatedroute: ActivatedRoute, private utilityService: UtilityService, private noteService: NoteService) {
    var categoryId = this._Activatedroute.snapshot.paramMap.get("id");
    console.log("categoryId :" + categoryId);
    if (categoryId != null) {
      this.categoryId = Number(categoryId);
    }
    this.noteInfoList = new Array;
    this.fetchNoteInfo()
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
    request.category = this.categoryId;
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
