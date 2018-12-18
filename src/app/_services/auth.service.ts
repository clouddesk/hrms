import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  private token: string;
  private helper = new JwtHelperService();

  checkToken(token: string) {
    if (!this.helper.isTokenExpired(token)) {
      this.token = token;
    }
  }

  constructor(private router: Router, private http: HttpClient) {}

  loginUser(email: string, password: string) {
    return this.http
      .post('http://localhost:3000/api/auth/', { email, password })
      .toPromise()
      .then(token => {
        this.token = token.toString();
        localStorage.setItem('currentUserToken', this.token);
        this.router.navigate(['/']);
      });
  }

  getToken() {
    if (this.token != null) {
      if (!this.helper.isTokenExpired(this.token)) {
        return this.token;
      }
    }
  }

  logoutUser() {
    localStorage.removeItem('currentUserToken');
    this.token = null;
    this.router.navigate(['/']);
  }

  signupUser(name: string, email: string, password: string) {
    return this.http
      .post('http://localhost:3000/api/users/', {
        name,
        email,
        password
      })
      .toPromise()
      .then(() => this.router.navigate(['/']));
  }

  isAuthenticated() {
    if (!this.token) {
      return false;
    }
    if (this.helper.isTokenExpired(this.token)) {
      this.token = null;
    }
    return this.token != null;
  }
}
