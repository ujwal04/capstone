import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    this.getUserType()
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/register`, { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, { email, password }).pipe(
      map(response => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token || '');
  }

  getUserType(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.userType || 'user';
    }
    return 'user';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken; // You might want to adjust this based on your token structure
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
