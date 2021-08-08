export class LoginResponse{
    status: number;
    message: string;
    name: string;
    username: string;
    accessToken: string;
    id: number;

    constructor(){
        this.status = 1;
        this.accessToken = "test";
        this.message = "success";
        this.username = "";
        this.id = 1;
        this.name = "";

    }
}