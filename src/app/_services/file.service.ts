import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class FileService {
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

  getFiles(): Observable<any> {
    const url = environment.DatabaseAPI_files;
    return this.http.get(url, { headers: this.getHeader() });
  }

  getFile(file_id: number): Observable<any> {
    if (file_id) {
      const url = environment.DatabaseAPI_files + file_id;
      return this.http.get(url, {
        headers: this.getHeader(),
        responseType: 'blob' as 'json'
      });
    }
  }

  uploadFile(file): Observable<any> {
    const url = environment.DatabaseAPI_files;
    return this.http.post(url, file, { headers: this.getHeader() });
  }

  deleteFile(index: number): Observable<any> {
    const url = environment.DatabaseAPI_files + index;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  createBlob(imageBase64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(imageBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
