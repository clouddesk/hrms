import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
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
        returnFaceId: 'true'
        // returnFaceLandmarks: 'false',
        // returnFaceAttributes: 'age,gender,emotion,hair'
      }
    });
  }

  public createPersonGroup(
    personGroupId: string,
    personGroupName: string
  ): Observable<any> {
    return this.http.put(
      `${environment.FaceAPI_person_group}/${personGroupId}`,
      { name: personGroupName },
      {
        headers: this.getHeader()
      }
    );
  }

  // FIXME: this is not working, responding that permission is denied ??? WTF? CORS ??
  public trainPersonGroup(personGroupId: string): Observable<any> {
    return this.http.post(
      `${environment.FaceAPI_person_group}/${personGroupId}/train`,
      {
        headers: this.getHeader()
      }
    );
  }

  public checkPersonGroupTrainingStatus(
    personGroupId: string
  ): Observable<any> {
    return this.http.get(
      `${environment.FaceAPI_person_group}/${personGroupId}/training`,
      {
        headers: this.getHeader()
      }
    );
  }

  public detectPerson(blob: Blob): Observable<any> {
    return this.http.post(`${environment.FaceAPI_detect}`, blob, {
      headers: this.getHeader('application/octet-stream'),
      params: this.getParameters()
    });
  }

  public verifyPerson(
    faceId: string,
    personGroupId: string,
    personId: string
  ): Observable<any> {
    return this.http.post(
      `${environment.FaceAPI_verify}`,
      {
        faceId: faceId,
        personGroupId: personGroupId,
        personId: personId
      },
      {
        headers: this.getHeader()
      }
    );
  }

  public deletePersonGroup(personGroupId: string): Observable<any> {
    return this.http.delete(
      `${environment.FaceAPI_person_group}/${personGroupId}`,
      { headers: this.getHeader() }
    );
  }

  public listPersonGroups(): Observable<any> {
    return this.http.get(`${environment.FaceAPI_person_group}`, {
      headers: this.getHeader()
    });
  }

  public addPersonToPersonGroup(
    personGroupId: string,
    personName: string
  ): Observable<any> {
    return this.http.post(
      `${environment.FaceAPI_person_group}/${personGroupId}/persons`,
      { name: personName },
      {
        headers: this.getHeader()
      }
    );
  }

  public deletePersonFromPersonGroup(
    personGroupId: string,
    personId: string
  ): Observable<any> {
    return this.http.delete(
      `${environment.FaceAPI_person_group}/${personGroupId}/persons/${personId}`,
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
      `${
        environment.FaceAPI_person_group
      }/${personGroupId}/persons/${personId}/persistedFaces`,
      blob,
      {
        headers: this.getHeader('application/octet-stream')
        // params: this.getParameters()
      }
    );
  }

  public deleteFaceOfAPerson(
    personGroupId: string,
    personId: string,
    persistedFaceId: string
  ): Observable<any> {
    return this.http.delete(
      `${
        environment.FaceAPI_person_group
      }/${personGroupId}/persons/${personId}/persistedFaces/${persistedFaceId}`,
      {
        headers: this.getHeader()
      }
    );
  }
}
