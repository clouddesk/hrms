import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { merge, of as observableOf, Subject } from 'rxjs';
import { MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  catchError
} from 'rxjs/operators';
import { user_directory_params } from 'src/environments/environment';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-directory',
  templateUrl: './user-directory.component.html',
  styleUrls: ['./user-directory.component.scss']
})
export class UserDirectoryComponent implements OnInit {
  users: User[] = [];
  defaultPageSize: string;

  userActiveForEditing: number[] = [];

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'actions'
  ];

  resultsLength = 0;
  isLoadingResults = true;
  searchTextChanged = new Subject<string>();

  search_event_log;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  pageEvent: PageEvent;

  ngOnInit() {
    this.defaultPageSize = user_directory_params.userDirectoryDefaultPageSize;

    this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0),
      err => console.log(err.error.error.code + ': ' + err.error.error.message)
    );
    this.getUsers();

    this.searchTextChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        res => {
          this.getUsers(res);
        },
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }

  containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  editUser(userId: number) {
    if (!this.containsObject(userId, this.userActiveForEditing)) {
      this.userActiveForEditing.push(userId);
    }
  }

  saveUser(userId: any, firstName: string, lastName: string) {
    this.userService
      .editUser(userId, { firstName: firstName, lastName: lastName })
      .subscribe(() => {
        this.getUsers();
        for (let i = 0; i < this.userActiveForEditing.length; i++) {
          if (this.userActiveForEditing[i] === userId) {
            this.userActiveForEditing.splice(i, 1);
          }
        }
      });
  }
  search($event) {
    this.searchTextChanged.next($event.target.value);
    this.search_event_log = $event.target.value;
  }

  ViewUserForm(i: number) {
    // ....
  }

  addUserForm() {
    // ...
  }

  removeUser(user_id: number) {
    this.userService.removeUser(user_id).subscribe(() => {
      this.getUsers();
    });
  }

  getUsers(terms?) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const limit: string = this.paginator.pageSize
            ? this.paginator.pageSize.toString()
            : user_directory_params.userDirectoryDefaultPageSize;
          return this.userService.getUsers(
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
        data => (this.users = data),
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }
}
