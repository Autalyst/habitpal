import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}

    getAuthenticationTokens() {
        return {
            jwt: "1789371281",
            refresh: "wwadwahuiodw"
        };
    }

    refreshToken() {
        return this.http.post('api/refreshToken', {});
    }
}