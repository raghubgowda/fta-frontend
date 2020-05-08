import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    apiUrl: string = 'http://localhost:8080/api/v1/users';
    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post(`${this.apiUrl}/sign-up`, user);
    }
}
