import { Component, OnInit, ViewChild } from '@angular/core';
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

import { sysobject_directory_params } from '../../../../environments/environment';
import { SysObjectService } from 'src/app/_services/sys-object.service';

@Component({
  selector: 'app-sysobject-directory',
  templateUrl: './sysobject-directory.component.html',
  styleUrls: ['./sysobject-directory.component.scss']
})
export class SysobjectDirectoryComponent implements OnInit {
  sysObjects: [] = [];
  displayedColumns = ['id', 'name', 'actions'];
  defaultPageSize: string;

  sysObjectActiveForEditing: number[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  searchTextChanged = new Subject<string>();

  search_event_log;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private sysObjectService: SysObjectService) {}

  pageEvent: PageEvent;

  ngOnInit() {
    this.defaultPageSize =
      sysobject_directory_params.sysObjectDirectoryDefaultPageSize;
    this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0),
      err => console.log(err.error.error.code + ': ' + err.error.error.message)
    );
    this.getSysObjects();

    this.searchTextChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        res => {
          this.getSysObjects(res);
        },
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }

  search($event) {
    this.searchTextChanged.next($event.target.value);
    this.search_event_log = $event.target.value;
  }

  containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  editSysObject(sysObjectId: number) {
    if (!this.containsObject(sysObjectId, this.sysObjectActiveForEditing)) {
      this.sysObjectActiveForEditing.push(sysObjectId);
    }
  }

  saveSysObject(sysObjectId: any, sysObjectName: string) {
    this.sysObjectService
      .editSysObject(sysObjectId, { name: sysObjectName })
      .subscribe(() => {
        this.getSysObjects();
        for (let i = 0; i < this.sysObjectActiveForEditing.length; i++) {
          if (this.sysObjectActiveForEditing[i] === sysObjectId) {
            this.sysObjectActiveForEditing.splice(i, 1);
          }
        }
      });
  }

  removeSysObject(sysObjectId: number) {
    this.sysObjectService
      .removeSysObject(sysObjectId)
      .subscribe(() => this.getSysObjects(), error => console.log(error));
  }

  getSysObjects(terms?) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const limit: string = this.paginator.pageSize
            ? this.paginator.pageSize.toString()
            : sysobject_directory_params.sysObjectDirectoryDefaultPageSize;
          return this.sysObjectService.getSysObjects(
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
        data => {
          this.sysObjects = data;
        },
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }
}
