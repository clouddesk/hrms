import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AttendanceService {
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

  createEvent(
    eventTypeId: any,
    position: Position,
    employeeId: number,
    projectId: number
  ): Observable<any> {
    const url = environment.API_attendance;
    const data = {
      eventTypeId: eventTypeId,
      projectId: projectId,
      position: {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      },
      employeeId: employeeId
    };
    return this.http.post(url, data, { headers: this.getHeader() });
  }

  linkPhotoWithAttendance(attendance_id: number, file_id: string): Observable<any> {
    const url = environment.API_attendance_linkPhoto + attendance_id;
    return this.http.post(
      url,
      { file_id: file_id },
      {
        headers: this.getHeader()
      }
    );
  }


  unlinkPhotoFromAttendance(attendance_id: number): Observable<any> {
    const url = environment.API_attendance_unLinkPhoto + attendance_id;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }
}
