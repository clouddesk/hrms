import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, PageEvent } from '@angular/material';
import { merge, of as observableOf, Subject } from 'rxjs';
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
import { PermissionService } from 'src/app/_services/permission.service';
import { SysObjectService } from 'src/app/_services/sys-object.service';
import { GroupService } from 'src/app/_services/group.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  permissions = [];
  objects = [];

  displayedColumns = ['1', '2', 'actions'];
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
    this.permissionService
      .addPermission(+this.route.snapshot.params['id'], newPermission)
      .subscribe(() => {
        this.permissionService
          .getAllPermissionsForGroup(+this.route.snapshot.params['id'])
          .subscribe(permissions => {
            this.permissions = permissions;
            this.router.navigate(['.'], { relativeTo: this.route });
            this.displayNewPermissionForm = !this.displayNewPermissionForm;
          });
      });
  }

  constructor(
    private permissionService: PermissionService,
    private sysObjectService: SysObjectService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  addNewPermission() {
    this.displayNewPermissionForm = !this.displayNewPermissionForm;
  }

  ngOnInit() {
    this.defaultPageSize =
      permission_directory_params.permissionDirectoryDefaultPageSize;
    this.getPermissionsForGroup();
    this.route.params.subscribe(param => {
      this.permissionService
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
    this.sysObjectService.getAllSysObjects().subscribe(data => {
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
    this.permissionService
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
          return this.permissionService.getPermissionsForGroup(
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
    this.groupService
      .removeGroup(this.route.snapshot.params['id'])
      .subscribe(() => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
  }
}
