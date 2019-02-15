import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SysObjectService {
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

  addNewSysObject(sysObject: any): Observable<any> {
    return this.http.post(environment.DatabaseAPI_sysObjects, sysObject, {
      headers: this.getHeader()
    });
  }

  getAllSysObjects(): Observable<any> {
    const httpOptions = {
      headers: this.getHeader().append('getallsysobjects', 'yes')
    };
    return this.http.get(environment.DatabaseAPI_sysObjects, httpOptions);
  }

  getSysObjects(
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
    return this.http.get(environment.DatabaseAPI_sysObjects, httpOptions);
  }

  editSysObject(sysObjectId: number, newSysObject: any): Observable<any> {
    const url = environment.DatabaseAPI_sysObjects + sysObjectId;
    return this.http.post(url, newSysObject, {
      headers: this.getHeader()
    });
  }

  removeSysObject(sysObjectId: number): Observable<any> {
    return this.http.delete(environment.DatabaseAPI_sysObjects + sysObjectId, {
      headers: this.getHeader()
    });
  }
}
