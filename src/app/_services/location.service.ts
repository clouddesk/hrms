import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class LocationService {
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

  addLocation(newLocation: any): Observable<any> {
    const url = environment.API_Location;
    const data = {
      name: newLocation.locationName,
      address: newLocation.locationAddress,
      position: newLocation.locationPosition
    };
    return this.http.post(url, data, { headers: this.getHeader() });
  }

  removeLocation(locationId: number): Observable<any> {
    const url = environment.API_Location + locationId;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  getLocation(locationId: number): Observable<any> {
    if (locationId) {
      const url = environment.API_Location + locationId;
      return this.http.get(url, {
        headers: this.getHeader()
      });
    }
  }

  getLocations(): Observable<any> {
    const url = environment.API_Location;
    return this.http.get(url, { headers: this.getHeader() });
  }
}
