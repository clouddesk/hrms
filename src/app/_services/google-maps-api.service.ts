import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleMapsApiService {
  constructor(private http: HttpClient) {}

  getLocationMap(
    latitude: string,
    longitude: string,
    zoom: string = '15',
    size: string = '500x500',
    maptype: string = 'hybrid',
    region: string = 'ge'
  ): Observable<any> {
    return this.http.get(
      `${
        environment.Google_Maps_API_static
      }center=${latitude},${longitude}&zoom=${zoom}&size=${size}&maptype=${maptype}&${region}&key=${
        environment.googleMapssubscriptionKey
      }`,
      {
        responseType: 'blob' as 'json'
      }
    );
  }
}
