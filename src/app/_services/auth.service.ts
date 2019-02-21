import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private token: string;
  private helper = new JwtHelperService();

  getUserName() {
    if (this.token) {
      return this.helper.decodeToken(this.token).name;
    }
  }

  checkToken(token: string) {
    if (!this.helper.isTokenExpired(token)) {
      this.token = token;
    }
  }

  constructor(private router: Router, private http: HttpClient) {}

  loginUser(email: string, password: string) {
    return this.http
      .post(environment.API_auth, { email, password })
      .toPromise()
      .then(token => {
        this.token = token.toString();
        localStorage.setItem('currentUserToken', this.token);
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

  signupUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    companyId
  ) {
    return this.http
      .post(environment.API_users, {
        firstName,
        lastName,
        email,
        password,
        companyId
      })
      .toPromise()
      .then(() => this.router.navigate(['/']));
  }

  isAuthenticated() {
    if (!this.token) {
      return false;
    } else {
      if (this.helper.isTokenExpired(this.token)) {
        this.token = null;
        return false;
      }
    }
    return true;
  }
}
