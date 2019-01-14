import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
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

  // ============================ EMPLOYEE SERVICES =================================

  getEmployees(
    sort: string,
    order: string,
    page: string,
    limit: string,
    term: string
  ): Observable<any> {
    const httpOptions = {
      headers: this.getHeader('application/json'),
      params: new HttpParams()
        .set('sort', sort)
        .append('order', order)
        .append('page', page)
        .append('limit', limit)
        .append('term', term)
    };
    return this.http.get('http://localhost:3000/api/employees/', httpOptions);
  }

  getEmployee(employeeId): Observable<any> {
    const url = 'http://localhost:3000/api/employees/' + employeeId;
    return this.http.get(url, { headers: this.getHeader('application/json') });
  }

  addNewEmployee(employee: any): Observable<any> {
    const url = 'http://localhost:3000/api/employees/';
    return this.http.post(url, employee, {
      headers: this.getHeader('application/json')
    });
  }

  addPersonIdToEmployee(employeeId: number, personId: string): Observable<any> {
    const url = 'http://localhost:3000/api/employees/addpersonid/' + employeeId;
    return this.http.post(
      url,
      { personId: personId },
      {
        headers: this.getHeader()
      }
    );
  }

  addPersonGroupIdToEmployee(
    employeeId: number,
    personGroupId: number
  ): Observable<any> {
    const url =
      'http://localhost:3000/api/employees/addpersongroupid/' + employeeId;
    return this.http.post(
      url,
      { personGroupId: personGroupId },
      {
        headers: this.getHeader()
      }
    );
  }

  addPersistedFaceIdtoEmployee(
    employeeId: number,
    persistedFaceId: string
  ): Observable<any> {
    const url =
      'http://localhost:3000/api/employees/addpersistedfaceid/' + employeeId;
    return this.http.post(
      url,
      { persistedFaceId: persistedFaceId },
      {
        headers: this.getHeader()
      }
    );
  }

  removePersistedFaceIdFromEmployee(employeeId: number): Observable<any> {
    const url =
      'http://localhost:3000/api/employees/removepersistedfaceid/' + employeeId;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  editEmployee(employeeId: number, newEmployee: any): Observable<any> {
    const url = 'http://localhost:3000/api/employees/' + employeeId;
    return this.http.post(url, newEmployee, {
      headers: this.getHeader('application/json')
    });
  }

  linkPhotoWithPerson(employee_id: number, file_id: string): Observable<any> {
    const url = 'http://localhost:3000/api/employees/linkphoto/' + employee_id;
    return this.http.post(
      url,
      { file_id: file_id },
      {
        headers: this.getHeader()
      }
    );
  }

  unlinkPhotoFromPerson(employee_id: number): Observable<any> {
    const url =
      'http://localhost:3000/api/employees/unlinkphoto/' + employee_id;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  removeEmployee(employeeId: number): Observable<any> {
    const url = 'http://localhost:3000/api/employees/' + employeeId;
    return this.http.delete(url, {
      headers: this.getHeader('application/json')
    });
  }

  // ================================ END ===========================================

  // =============================== POST SERVICES ==================================

  getPosts(): Observable<any> {
    const url = 'http://localhost:3000/api/posts/';
    return this.http.get(url, { headers: this.getHeader('application/json') });
  }

  addPost(newPost: any): Observable<any> {
    const url = 'http://localhost:3000/api/posts/';
    return this.http.post(url, newPost, {
      headers: this.getHeader('application/json')
    });
  }

  editPost(index: number): Observable<any> {
    const url = 'http://localhost:3000/api/posts/' + index;
    return this.http.post(url, { headers: this.getHeader('application/json') });
  }

  deletePost(index: number): Observable<any> {
    const url = 'http://localhost:3000/api/posts/' + index;
    return this.http.delete(url, {
      headers: this.getHeader('application/json')
    });
  }

  // ================================== END =========================================

  // =============================== FILES SERVICES ==================================

  getFiles(): Observable<any> {
    const url = 'http://localhost:3000/api/files/';
    return this.http.get(url, { headers: this.getHeader('application/json') });
  }

  getFile(file_id: number): Observable<any> {
    const url = 'http://localhost:3000/api/files/' + file_id;
    return this.http.get(url, {
      headers: this.getHeader(),
      responseType: 'blob' as 'json'
    });
  }

  uploadFile(file): Observable<any> {
    const url = 'http://localhost:3000/api/files/';
    return this.http.post(url, file, { headers: this.getHeader() });
    // return this.http.post(url, file, { headers: this.getHeader('application/octet-stream') });
  }

  deleteFile(index: number): Observable<any> {
    const url = 'http://localhost:3000/api/files/' + index;
    return this.http.delete(url, {
      headers: this.getHeader('application/json')
    });
  }

  // ================================== END =========================================
}
