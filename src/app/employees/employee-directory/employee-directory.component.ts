import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
import { DataService } from 'src/app/_services/data.service';
import { EmployeeComponent } from '../employee/employee.component';
import { merge, of as observableOf, Subject } from 'rxjs';
import {
  catchError,
  map,
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MsFaceApiService } from 'src/app/_services/ms-face-api.service';

@Component({
  selector: 'app-employee-directory',
  templateUrl: './employee-directory.component.html',
  styleUrls: ['./employee-directory.component.scss']
})
export class EmployeeDirectoryComponent implements OnInit {
  dataSource: DataService | null;
  data: Employee[] = [];

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'personalId',
    'birthDate',
    'mobilePhone',
    'actions'
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchTextChanged = new Subject<string>();

  search_event_log;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dataService: DataService,
    private faceApi: MsFaceApiService,
    private http: HttpClient,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  pageEvent: PageEvent;

  ngOnInit() {
    this.dataSource = new DataService(this.http, this.authService);

    this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0),
      err => console.log(err.error.error.code + ': ' + err.error.error.message)
    );
    this.getEmployees();

    this.searchTextChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        res => {
          this.getEmployees(res);
        },
        err => console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }

  search($event) {
    this.searchTextChanged.next($event.target.value);
    this.search_event_log = $event.target.value;
  }

  ViewEmployeeForm(i: number) {
    this.dataService.getEmployee(i).subscribe(employee => {
      const dialogRef = this.dialog.open(EmployeeComponent, {
        width: '500px',
        data: employee
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getEmployees(this.search_event_log);
      });
    });
  }

  addEmployeeForm() {
    const dialogRef = this.dialog.open(EmployeeComponent, {
      width: '500px',
      data: null
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getEmployees(this.search_event_log);
    });
  }

  onDeleteEmployee(employee_id: number) {
    this.dataService.getEmployee(employee_id).subscribe(
      employee => {
        if (employee.employeePhotoFileId) {
          this.dataService.deleteFile(employee.employeePhotoFileId).subscribe(
            () => {
              this.faceApi
                .deletePersonFromPersonGroup(
                  employee.personGroupId,
                  employee.personId
                )
                .subscribe(
                  () => {
                    this.dataService.removeEmployee(employee_id).subscribe(
                      () => {
                        this.getEmployees(this.search_event_log);
                      },
                      err => console.log(err.error.error.code + ': ' + err.error.error.message)
                    );
                  },
                  err => console.log(err.error.error.code + ': ' + err.error.error.message)
                );
            },
            err => console.log(err.error.error.code + ': ' + err.error.error.message)
          );
        } else {
          this.faceApi
            .deletePersonFromPersonGroup(
              employee.personGroupId,
              employee.personId
            )
            .subscribe(
              () => {
                this.dataService.removeEmployee(employee_id).subscribe(
                  () => {
                    this.getEmployees(this.search_event_log);
                  },
                  err => console.log(err.error.error.code + ': ' + err.error.error.message)
                );
              },
              err => console.log(err.error.error.code + ': ' + err.error.error.message)
            );
        }
      },
      err => console.log(err.error.error.code + ': ' + err.error.error.message)
    );
  }

  getEmployees(terms?) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const limit: string = this.paginator.pageSize
            ? this.paginator.pageSize.toString()
            : '10';
          return this.dataSource.getEmployees(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex.toString(),
            limit,
            terms
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = data), err => console.log(err.error.error.code + ': ' + err.error.error.message));
  }
}
