import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ReportService {
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

  getAttendance(fromDate: any, toDate: any, projectId: number): Observable<any> {
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      projectId: projectId
    };
    const url = environment.API_report + 'attendance';
    return this.http.post(url, data, {
      headers: this.getHeader()
    });
  }
  getAttendaceSummary(fromDate: any, toDate: any,  projectId: number): Observable<any> {
    const httpOptions = {
      headers: this.getHeader().append('getallpermissions', 'yes'),
      params: new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('projectId', projectId.toString())
    };
    const url = environment.API_report + 'attendance/summary';
    return this.http.get(url, httpOptions);
  }

}
