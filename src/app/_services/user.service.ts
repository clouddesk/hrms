import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  private getHeader(contentType?: string): HttpHeaders {
    if (contentType) {
      return new HttpHeaders({
        'Content-Type': contentType,
        'x-auth-token': this.authService.getToken()
      });
    } else {
      return new HttpHeaders({
        'x-auth-token': this.authService.getToken()
      });
    }
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(
    sort: string,
    order: string,
    page: string,
    limit: string,
    term: string
  ): Observable<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('sort', sort)
        .append('order', order)
        .append('page', page)
        .append('limit', limit)
        .append('term', term)
    };
    return this.http.get(environment.DatabaseAPI_users, httpOptions);
  }

  addNewUser(user: any): Observable<any> {
    return this.http.post(environment.DatabaseAPI_users, user, {
      headers: this.getHeader()
    });
  }

  editUser(userId: number, newUser: any): Observable<any> {
    const url = environment.DatabaseAPI_users + userId;
    return this.http.post(url, newUser, {
      headers: this.getHeader()
    });
  }

  removeUser(userId: number): Observable<any> {
    return this.http.delete(environment.DatabaseAPI_users + userId, {
      headers: this.getHeader()
    });
  }
}
