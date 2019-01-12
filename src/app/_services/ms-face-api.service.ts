import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsFaceApiService {
  constructor(private http: HttpClient) {}

  private getHeader(contentType?: string): HttpHeaders {
    if (contentType) {
      return new HttpHeaders({
        'Content-Type': contentType,
        'Ocp-Apim-Subscription-Key': environment.subscriptionKey
      });
    } else {
      return new HttpHeaders({
        'Ocp-Apim-Subscription-Key': environment.subscriptionKey
      });
    }
  }

  private getParameters(): HttpParams {
    return new HttpParams({
      fromObject: {
        returnFaceId: 'true',
        returnFaceLandmarks: 'false',
        returnFaceAttributes: 'age,gender,emotion,hair'
      }
    });
  }

  public createPersonGroup(
    personGroupId: HTMLInputElement,
    personGroupName: HTMLInputElement
  ): Observable<any> {
    return this.http.put(
      `${environment.FaceAPI_person_group}/${personGroupId.value}`,
      { name: personGroupName.value },
      {
        headers: this.getHeader()
      }
    );
  }

  public listPersonGroups(): Observable<any> {
    return this.http.get(`${environment.FaceAPI_person_group}`, {
      headers: this.getHeader()
    });
  }

  public addPersonToPersonGroup(
    personGroupId: string,
    personName: HTMLInputElement
  ): Observable<any> {
    const person = personName.value;
    return this.http.post(
      `${environment.FaceAPI_person_group}/${personGroupId}/persons`,
      { name: person },
      {
        headers: this.getHeader()
      }
    );
  }

  public listPersonOfPersonGroup(personGroupId: string): Observable<any> {
    return this.http.get(
      `${environment.FaceAPI_person_group}/${personGroupId}/persons`,
      {
        headers: this.getHeader()
      }
    );
  }

  public addFaceToPerson(
    blob,
    personGroupId: string,
    personId: string
  ): Observable<any> {
    return this.http.post(
      `${environment.FaceAPI_person_group}/${personGroupId}/persons/${personId}/persistedFaces`,
      blob,
      {
        headers: this.getHeader('application/octet-stream'),
        // params: this.getParameters()
      }
    );
  }
}
