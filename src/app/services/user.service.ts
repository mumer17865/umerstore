// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  registerUser(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Custom-Header': 'HeaderValue',
    });
    return this.http.post(`${this.apiUrl}/register`, data, { headers });
  }

  loginUser(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Custom-Header': 'HeaderValue',
    });
    return this.http.post(`${this.apiUrl}/login`, data, { headers });
  }
}
