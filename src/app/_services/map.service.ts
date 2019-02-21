import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class MapService {
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

  getLocationMap(latitude: string, longitude: string): Observable<any> {
    return this.http.get(environment.API_map, {
      params: new HttpParams()
        .append('latitude', latitude)
        .append('longitude', longitude),
      headers: this.getHeader(),
      // responseType: 'blob' as 'json'
    });
  }
}
