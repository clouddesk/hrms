import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
      headers: this.getHeader(),
      params: new HttpParams()
        .set('sort', sort)
        .append('order', order)
        .append('page', page)
        .append('limit', limit)
        .append('term', term)
    };
    return this.http.get(environment.DatabaseAPI_Employee, httpOptions);
  }

  getEmployee(employeeId): Observable<any> {
    const url = environment.DatabaseAPI_Employee + employeeId;
    return this.http.get(url, { headers: this.getHeader() });
  }

  addNewEmployee(employee: any): Observable<any> {
    const url = environment.DatabaseAPI_Employee;
    return this.http.post(url, employee, {
      headers: this.getHeader()
    });
  }

  addPersonIdToEmployee(employeeId: number, personId: string): Observable<any> {
    const url = environment.DatabaseAPI_Employee_addPersonId + employeeId;
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
    const url = environment.DatabaseAPI_Employee_addPersonGroupId + employeeId;
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
      environment.DatabaseAPI_Employee_addPersistedFaceId + employeeId;
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
      environment.DatabaseAPI_Employee_addPersistedFaceId + employeeId;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  editEmployee(employeeId: number, newEmployee: any): Observable<any> {
    const url = environment.DatabaseAPI_Employee + employeeId;
    return this.http.post(url, newEmployee, {
      headers: this.getHeader()
    });
  }

  linkPhotoWithPerson(employee_id: number, file_id: string): Observable<any> {
    const url = environment.DatabaseAPI_Employee_linkPhoto + employee_id;
    return this.http.post(
      url,
      { file_id: file_id },
      {
        headers: this.getHeader()
      }
    );
  }

  unlinkPhotoFromPerson(employee_id: number): Observable<any> {
    const url = environment.DatabaseAPI_Employee_unLinkPhoto + employee_id;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  removeEmployee(employeeId: number): Observable<any> {
    const url = environment.DatabaseAPI_Employee + employeeId;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  // ================================ END ===========================================

  // =============================== USER SERVICES ==================================

  getUsers(
    sort: string,
    order: string,
    page: string,
    limit: string,
    term: string
  ): Observable<any> {
    const httpOptions = {
      headers: this.getHeader(),
      params: new HttpParams()
        .set('sort', sort)
        .append('order', order)
        .append('page', page)
        .append('limit', limit)
        .append('term', term)
    };
    return this.http.get(environment.DatabaseAPI_users, httpOptions);
  }

  addNewUser(user: any): Observable<any> {
    return this.http.post(environment.DatabaseAPI_users, user, {
      headers: this.getHeader()
    });
  }

  editUser(userId: number, newUser: any): Observable<any> {
    const url = environment.DatabaseAPI_users + userId;
    return this.http.post(url, newUser, {
      headers: this.getHeader()
    });
  }


  removeUser(userId: number): Observable<any> {
    console.log(environment.DatabaseAPI_users + userId);
    return this.http.delete(environment.DatabaseAPI_users + userId, {
      headers: this.getHeader()
    });
  }

  // ================================ END ===========================================
  // =============================== ATTENDANCE SERVICES ==================================

  createEvent(
    eventTypeId: any,
    position: Position,
    employeeId: number,
    projectId: number
  ): Observable<any> {
    const url = environment.DatabaseAPI_attendance;
    const data = {
      eventTypeId: eventTypeId,
      projectId: projectId,
      position: {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      },
      employeeId: employeeId
    };
    return this.http.post(url, data, { headers: this.getHeader() });
  }

  // ================================ END ===========================================

  // =============================== REPORT SERVICES ==================================

  getAttendace(fromDate: any, toDate: any, projectId: number): Observable<any> {
    const data = {
      fromDate: fromDate,
      toDate: toDate,
      projectId: projectId
    };
    const url = environment.DatabaseAPI_report + 'attendance';
    return this.http.post(url, data, {
      headers: this.getHeader()
    });
  }

  // ================================== END =========================================
  // =============================== PROJECT SERVICES ==================================

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

  // ================================== END =========================================

  // =============================== LOCATION SERVICES ==================================

  addLocation(newLocation: any): Observable<any> {
    const url = environment.DatabaseAPI_Location;
    const data = {
      name: newLocation.locationName,
      address: newLocation.locationAddress,
      position: newLocation.locationPosition
    };
    return this.http.post(url, data, { headers: this.getHeader() });
  }

  removeLocation(locationId: number): Observable<any> {
    const url = environment.DatabaseAPI_Location + locationId;
    return this.http.delete(url, {
      headers: this.getHeader()
    });
  }

  getLocation(locationId: number): Observable<any> {
    if (locationId) {
      const url = environment.DatabaseAPI_Location + locationId;
      return this.http.get(url, {
        headers: this.getHeader()
      });
    }
  }

  getLocations(): Observable<any> {
    const url = environment.DatabaseAPI_Location;
    return this.http.get(url, { headers: this.getHeader() });
  }

  // ================================== END =========================================

  // =============================== FILES SERVICES ==================================

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

  // ================================== END =========================================
}
