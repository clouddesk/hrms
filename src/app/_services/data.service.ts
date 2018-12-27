import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': this.authService.getToken()
    })
  };
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ============================ EMPLOYEE SERVICES =================================
  // ================================ START =========================================

  getEmployees(
    sort: string,
    order: string,
    page: string,
    limit: string,
    term: string,
  ): Observable<any> {
    const tempHttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': this.authService.getToken()
      }),
      params: new HttpParams()
        .set('sort', sort)
        .append('order', order)
        .append('page', page)
        .append('limit', limit)
        .append('term', term)
    };
    return this.http.get(
      'http://localhost:3000/api/employees/',
      tempHttpOptions
    );
  }

  getEmployee(index): Observable<any> {
    const url = 'http://localhost:3000/api/employees/' + index;
    return this.http.get(url, this.httpOptions);
  }

  addNewEmployee(employee: any): Observable<any> {
    const url = 'http://localhost:3000/api/employees/';
    return this.http.post(url, employee, this.httpOptions);
  }

  editEmployee(index: number, newEmployee: any): Observable<any> {
    const url = 'http://localhost:3000/api/employees/' + index;
    return this.http.post(url, newEmployee, this.httpOptions);
  }

  removeEmployee(index: number): Observable<any> {
    const url = 'http://localhost:3000/api/employees/' + index;
    return this.http.delete(url, this.httpOptions);
  }

  // ============================ EMPLOYEE SERVICES =================================
  // ================================ END ===========================================

  // =============================== POST SERVICES ==================================
  // =================================== START ======================================

  getPosts(): Observable<any> {
    const url = 'http://localhost:3000/api/posts/';
    return this.http.get(url, this.httpOptions);
  }

  addPost(newPost: any): Observable<any> {
    const url = 'http://localhost:3000/api/posts/';
    return this.http.post(url, newPost, this.httpOptions);
  }

  editPost(index: number): Observable<any> {
    const url = 'http://localhost:3000/api/posts/' + index;
    return this.http.post(url, this.httpOptions);
  }

  deletePost(index: number): Observable<any> {
    const url = 'http://localhost:3000/api/posts/' + index;
    return this.http.delete(url, this.httpOptions);
  }

  // =============================== POST SERVICES ==================================
  // ================================== END =========================================
}
