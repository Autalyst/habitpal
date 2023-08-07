import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, firstValueFrom, map } from "rxjs";

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

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResultDto>(
            'http://127.0.0.1:3000/auth', { email, password }
        ).pipe(
            map(result => {
                localStorage.clear();
                localStorage.setItem('JWT_TOKEN', result.jwtToken);
                localStorage.setItem('REFRESH_TOKEN', result.refreshToken);
                return true;
            })
        );
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

interface AuthResultDto {
    userId: string
    jwtToken: string
    refreshToken: string
}