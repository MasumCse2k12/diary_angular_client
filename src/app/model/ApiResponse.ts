export class ApiResponse {
    success: boolean;
    message: string;
    constructor(){
        this.success = false;
        this.message = "";
    }
}