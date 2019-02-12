import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, PageEvent } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { merge, of as observableOf, Subject } from 'rxjs';
import { DataService } from 'src/app/_services/data.service';
import {
  catchError,
  map,
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { permission_directory_params } from '../../../../environments/environment';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  permissions = [];
  objects = [];

  displayedColumns = ['1', '2', 'actions'];
  dataSource: DataService | null;
  defaultPageSize: string;

  resultsLength = 0;
  isLoadingResults = true;
  searchTextChanged = new Subject<string>();

  search_event_log;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageEvent: PageEvent;

  permissionForm: FormGroup;

  rights = [
    { name: 'create' },
    { name: 'read' },
    { name: 'update' },
    { name: 'delete' }
  ];

  displayNewPermissionForm = false;

  onSubmit() {
    const newPermission = {
      permission: this.permissionForm.value.inputPermissionName,
      object: this.permissionForm.value.inputObjectName
    };
    this.dataService
      .addPermission(+this.route.snapshot.params['id'], newPermission)
      .subscribe(() => {
        this.dataService
          .getAllPermissionsForGroup(+this.route.snapshot.params['id'])
          .subscribe(permissions => {
            this.permissions = permissions;
            this.router.navigate(['.'], { relativeTo: this.route });
            this.displayNewPermissionForm = !this.displayNewPermissionForm;
          });
      });
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  addNewPermission() {
    this.displayNewPermissionForm = !this.displayNewPermissionForm;
  }

  ngOnInit() {
    this.defaultPageSize =
      permission_directory_params.permissionDirectoryDefaultPageSize;
    this.dataSource = new DataService(this.http, this.authService);
    this.getPermissionsForGroup();
    this.route.params.subscribe(param => {
      this.dataService
        .getAllPermissionsForGroup(+param['id'])
        .subscribe(data => {
          this.permissions = data;
        });
    });
    this.searchTextChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        res => {
          this.getPermissionsForGroup(res);
        },
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
    this.dataService.getAllSysObjects().subscribe(data => {
      this.objects = data;
    });
    this.permissionForm = new FormGroup({
      inputPermissionName: new FormControl(null, Validators.required),
      inputObjectName: new FormControl(null, Validators.required)
    });
  }

  search($event) {
    this.searchTextChanged.next($event.target.value);
    this.search_event_log = $event.target.value;
  }

  removePermission(
    permissionId: number,
    sysObject: string,
    permission: string
  ) {
    this.dataService
      .removePermission(permissionId, sysObject, permission)
      .subscribe(
        () => this.getPermissionsForGroup(),
        error => console.log(error)
      );
  }

  getPermissionsForGroup(terms?) {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.dataSource.getPermissionsForGroup(
            +this.route.snapshot.params['id'],
            terms
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(
        data => {
          this.permissions = data;
        },
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }

  removeGroup() {
    this.dataService
      .removeGroup(this.route.snapshot.params['id'])
      .subscribe(() => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
  }
}
