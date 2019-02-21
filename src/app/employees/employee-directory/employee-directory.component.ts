import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
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
import { FaceApiService } from 'src/app/_services/face.service';
import { employee_directory_params } from '../../../environments/environment';
import { EmployeeService } from 'src/app/_services/employee.service';
import { FileService } from 'src/app/_services/file.service';

@Component({
  selector: 'app-employee-directory',
  templateUrl: './employee-directory.component.html',
  styleUrls: ['./employee-directory.component.scss']
})
export class EmployeeDirectoryComponent implements OnInit {
  data: Employee[] = [];
  defaultPageSize: string;

  displayedColumns: string[] = [
    'id',
    'photo',
    'firstName',
    'lastName',
    'personalId',
    'birthDate',
    'mobilePhone',
    'actions'
  ];

  resultsLength = 0;
  isLoadingResults = true;
  searchTextChanged = new Subject<string>();

  search_event_log;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private faceApi: FaceApiService,
    private employeeService: EmployeeService,
    private fileService: FileService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  pageEvent: PageEvent;

  ngOnInit() {
    this.defaultPageSize =
      employee_directory_params.employeeDirectoryDefaultPageSize;

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
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }

  search($event) {
    this.searchTextChanged.next($event.target.value);
    this.search_event_log = $event.target.value;
  }

  ViewEmployeeForm(i: number) {
    this.employeeService.getEmployee(i).subscribe(employee => {
      const dialogRef = this.dialog.open(EmployeeComponent, {
        width: '500px',
        data: employee
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getEmployees(this.search_event_log);
      });
      // dialogRef.afterClosed().subscribe();
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
    this.employeeService.getEmployee(employee_id).subscribe(
      employee => {
        if (employee.employeePhotoFileId) {
          this.fileService.deleteFile(employee.employeePhotoFileId).subscribe(
            () => {
              this.faceApi
                .deletePersonFromPersonGroup(
                  employee.personGroupId,
                  employee.personId
                )
                .subscribe(
                  () => {
                    this.employeeService.removeEmployee(employee_id).subscribe(
                      () => {
                        this.getEmployees(this.search_event_log);
                      },
                      err =>
                        console.log(
                          err.error.error.code + ': ' + err.error.error.message
                        )
                    );
                  },
                  err =>
                    console.log(
                      err.error.error.code + ': ' + err.error.error.message
                    )
                );
            },
            err =>
              console.log(err.error.error.code + ': ' + err.error.error.message)
          );
        } else {
          this.faceApi
            .deletePersonFromPersonGroup(
              employee.personGroupId,
              employee.personId
            )
            .subscribe(
              () => {
                this.employeeService.removeEmployee(employee_id).subscribe(
                  () => {
                    this.getEmployees(this.search_event_log);
                  },
                  err =>
                    console.log(
                      err.error.error.code + ': ' + err.error.error.message
                    )
                );
              },
              err =>
                console.log(
                  err.error.error.code + ': ' + err.error.error.message
                )
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
            : employee_directory_params.employeeDirectoryDefaultPageSize;
          return this.employeeService.getEmployees(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex.toString(),
            limit,
            terms
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(
        data => (this.data = data),
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }
}
