import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ProjectService {
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

  addProject(newProject: any): Observable<any> {
    const url = environment.DatabaseAPI_Project;
    const data = {
      name: newProject.projectName,
      locationId: newProject.locationId
    };
    return this.http.post(url, data, { headers: this.getHeader() });
  }

  editProject(projectId: number, newProject: any): Observable<any> {
    const url = environment.DatabaseAPI_Project + projectId;
    return this.http.post(url, newProject, {
      headers: this.getHeader()
    });
  }

  removeProject(projectId: number): Observable<any> {
    const url = environment.DatabaseAPI_Project + projectId;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  getProject(projectId: number): Observable<any> {
    if (projectId) {
      const url = environment.DatabaseAPI_Project + projectId;
      return this.http.get(url, {
        headers: this.getHeader()
      });
    }
  }

  getProjects(): Observable<any> {
    const url = environment.DatabaseAPI_Project;
    return this.http.get(url, { headers: this.getHeader() });
  }

}
