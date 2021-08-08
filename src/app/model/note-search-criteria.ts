export class NoteSearchCriteria{
    noteId: number;
    title: string;
    category: number;
    constructor(){
        this.noteId = 0;
        this.title = "";
        this.category = 0;
    }
}