import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private apiUrl: string = 'http://localhost:8080/token';

    constructor(private http: HttpClient) {
        const stored: User = JSON.parse(localStorage.getItem('currentUser'));
        // drop a stored session whose token has already expired
        const expired = !!stored && this.isTokenExpired(stored.token);
        if (expired) {
            localStorage.removeItem('currentUser');
        }
        this.currentUserSubject = new BehaviorSubject<User>(expired ? null : stored);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        const user = this.currentUserSubject.value;
        if (user && this.isTokenExpired(user.token)) {
            this.logout();
            return null;
        }
        return user;
    }

    // reads the JWT `exp` claim; tokens that cannot be parsed are left to the server to reject (401)
    private isTokenExpired(token: string): boolean {
        if (!token) {
            return false;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
        } catch {
            return false;
        }
    }

    login(email:string, password:string) {
        let user: User = new User();
        user.email = email;
        user.password = password;

        return this.http.post<any>(`${this.apiUrl}/generate-token`, user)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
