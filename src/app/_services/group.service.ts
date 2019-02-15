import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class GroupService {
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

  addNewGroup(group: any): Observable<any> {
    return this.http.post(environment.DatabaseAPI_groups, group, {
      headers: this.getHeader()
    });
  }

  getAllGroups(): Observable<any> {
    const httpOptions = {
      headers: this.getHeader().append('getallgroups', 'yes')
    };
    return this.http.get(environment.DatabaseAPI_groups, httpOptions);
  }

  getGroups(
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
    return this.http.get(environment.DatabaseAPI_groups, httpOptions);
  }

  editGroup(groupId: number, newGroup: any): Observable<any> {
    const url = environment.DatabaseAPI_groups + groupId;
    return this.http.post(url, newGroup, {
      headers: this.getHeader()
    });
  }

  removeGroup(groupId: number): Observable<any> {
    return this.http.delete(environment.DatabaseAPI_groups + groupId, {
      headers: this.getHeader()
    });
  }
}
