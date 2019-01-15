import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

interface MenuItem {
  sequence: number;
  name: string;
  link: string;
  icon: string;
  description: string;
  hasParent: boolean;
  parent: number;
}

@Injectable()
export class MenuService {
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

  getMenu() {
    const url = 'http://localhost:3000/api/menu/';
    return this.http
      .get(url, {
        headers: this.getHeader()
      })
      .toPromise();
  }

  addNewMenuItem(newMenuItem: MenuItem): Observable<any> {
    const url = 'http://localhost:3000/api/menu/';
    return this.http
      .post(url, newMenuItem, {
        headers: this.getHeader()
      });
  }
}
