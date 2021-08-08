import { LoginResponse } from "./login-response";

export class UserInfo {
    username: string;
    name: string;
    accessToken: string;
    id: number;
    status: number;
    
    constructor(resp : LoginResponse) {
        this.id = resp.id;
        this.username = resp.username;
        this.name = resp.name;
        this.accessToken = resp.accessToken;
        this.status = resp.status;
    }
}