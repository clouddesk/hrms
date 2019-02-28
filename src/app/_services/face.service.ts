import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class FaceApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

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

  public createPersonGroup(personGroup): Observable<any> {
    return this.http.post(
      environment.API_face_persongroups,
      personGroup,
      {
        headers: this.getHeader()
      }
    );
  }

  public detectPerson(blob: FormData): Observable<any> {
    return this.http.post(environment.API_face_detectperson, blob, {
      headers: this.getHeader()
    });
  }

  public verifyPerson(
    faceId: string,
    personGroupId: string,
    personId: string
  ): Observable<any> {
    return this.http.post(
      `${environment.API_face_verifyperson}`,
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
    return this.http.delete(environment.API_face_persongroups + personGroupId, {
      headers: this.getHeader()
    });
  }

  public editPersonGroup(
    personGroupId: string,
    personGroupName: string
  ): Observable<any> {
    return this.http.post(
      environment.API_face_persongroups + personGroupId,
      { name: personGroupName },
      { headers: this.getHeader() }
    );
  }

  public listPersonGroups(): Observable<any> {
    return this.http.get(environment.API_face_persongroups, {
      headers: this.getHeader()
    });
  }

  public addPersonToPersonGroup(
    personGroupId: string,
    personName: string
  ): Observable<any> {
    return this.http.post(
      environment.API_face_persongroupsperson,
      { personName: personName, personGroupId: personGroupId },
      {
        headers: this.getHeader()
      }
    );
  }

  public deletePersonFromPersonGroup(
    personGroupId: string,
    personId: string
  ): Observable<any> {
    return this.http.delete(environment.API_face_persongroupsperson + personId, {
      params: { personGroupId: personGroupId },
      headers: this.getHeader()
    });
  }

  public listPersonOfPersonGroup(personGroupId: string): Observable<any> {
    return this.http.get(environment.API_face_persongroupsperson, {
      params: { personGroupId: personGroupId },
      headers: this.getHeader()
    });
  }

  public addFaceToPerson(
    blob: FormData,
    personGroupId: string,
    personId: string
  ): Observable<any> {
    return this.http.post(environment.API_face_persistedface, blob, {
      params: { personGroupId: personGroupId, personId: personId },
      headers: this.getHeader()
    });
  }

  public deleteFaceOfAPerson(
    personGroupId: string,
    personId: string,
    persistedFaceId: string
  ): Observable<any> {
    return this.http.delete(environment.API_face_persistedface, {
      params: {
        personGroupId: personGroupId,
        personId: personId,
        persistedFaceId: persistedFaceId
      },
      headers: this.getHeader()
    });
  }
}
