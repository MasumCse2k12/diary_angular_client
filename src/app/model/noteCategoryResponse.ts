import { ApiResponse } from "./ApiResponse";
import { NoteCategory } from "./note-category";

export class NoteCategoryResponse extends ApiResponse{
    categoryList: Array<NoteCategory>;
    total: number;
    constructor(){
        super();
        this.total = 0;
        this.categoryList = new Array;
    }
}