import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}

    isAuthenticated(): boolean {
        const token = this.getJwtToken();
        return token != null;
    }

    getJwtToken(): string | null {
        return localStorage.getItem('JWT_TOKEN');
    }

    refreshToken() {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        return this.http.post('api/refreshToken', {});
    }

    login(email: string, password: string): Promise<Boolean> {
        return new Promise(async (success, reject) => {
            const request = this.http.post<TokenDto>(
                'http://127.0.0.1:3000/auth', 
                {
                    email,
                    password
                }
            );

            try {
                const tokens = await firstValueFrom(request);
                localStorage.setItem('JWT_TOKEN', tokens.jtw);
                localStorage.setItem('REFRESH_TOKEN', tokens.refresh);
            } catch(e) {
                reject(e);
            }
            success(true);
        });
    }

    async logout() {
        const refreshToken = this.getRefreshToken();

        if (refreshToken) {
            await firstValueFrom(this.http.delete(`http://127.0.0.1:3000/auth/${refreshToken}`));
        }

        localStorage.clear();
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem('REFRESH_TOKEN');
    }
}

interface TokenDto {
    jtw: string
    refresh: string
}