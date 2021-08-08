import { ApiResponse } from "./ApiResponse";

export class NoteInfoResponse extends ApiResponse{
    noteInfoList:  Array<any>;
    total: number;
    constructor(){
        super();
        this.total = 0;
        this.noteInfoList = new Array;
    }
}