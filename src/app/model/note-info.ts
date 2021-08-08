import { NoteCategory } from "./note-category";


export class NoteInfo{
    id: number;
    title: String;
    content: string;
    noteCategory: NoteCategory;
    updatedAt: string;
    createdAt: string;
    constructor(){
        this.id = 0;
        this.content = "";
        this.title = "";
        this.updatedAt ="";
        this.noteCategory = new NoteCategory();
        this.createdAt = "";
    } 

}