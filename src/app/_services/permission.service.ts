import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class PermissionService {
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

  getAllPermissionsForGroup(groupId?: number): Observable<any> {
    const httpOptions = {
      headers: this.getHeader().append('getallpermissions', 'yes')
    };
    return this.http.get(
      environment.DatabaseAPI_permissions_group + groupId,
      httpOptions
    );
  }

  getPermissionsForGroup(groupId: number, term: string): Observable<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams().append('term', term)
    };
    const url = environment.DatabaseAPI_permissions_group + groupId;
    return this.http.get(url, httpOptions);
  }

  addPermission(groupId: number, newPermission: any): Observable<any> {
    const url = environment.DatabaseAPI_permissions_group + groupId;
    return this.http.post(url, newPermission, { headers: this.getHeader() });
  }

  removePermission(
    groupId: number,
    sysObject: string,
    permission: string
  ): Observable<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .append('sysObject', sysObject)
        .append('permission', permission)
    };
    return this.http.delete(
      environment.DatabaseAPI_permissions_group + groupId,
      httpOptions
    );
  }
}
