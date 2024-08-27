import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import axios from 'axios';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
    // Set up interceptors once during service initialization
    this.setupAxiosInterceptors();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const token = sessionStorage.getItem('token');

    if (!token) {
      if (state.url === '/login' || state.url === '/registeruser') {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    } else {
      return from(
        axios.get('http://localhost:3000/authenticated', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ).pipe(
        map(response => {
          if (response.data.success) {
            if (state.url === '/login' || state.url === '/registeruser') {
              this.router.navigate(['/dashboard']);
              return false;
            } else {
              return true;
            }
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError(error => {
          this.router.navigate(['/login']);
          return [false];
        })
      );
    }
  }

  private setupAxiosInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(function (config) {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    // Response interceptor
    axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (error.response && error.response.status === 401) {
        sessionStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    });
  }
}
