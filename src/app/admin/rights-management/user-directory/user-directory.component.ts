import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { User } from 'src/app/models/user';
import { merge, of as observableOf, Subject } from 'rxjs';
import { MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
import { MsFaceApiService } from 'src/app/_services/ms-face-api.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_services/auth.service';
import { map, debounceTime, distinctUntilChanged, startWith, switchMap, catchError } from 'rxjs/operators';
import { UserComponent } from '../user/user.component';
import { user_directory_params } from 'src/environments/environment';

@Component({
  selector: 'app-user-directory',
  templateUrl: './user-directory.component.html',
  styleUrls: ['./user-directory.component.scss']
})
export class UserDirectoryComponent implements OnInit {

  dataSource: DataService | null;
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
    private dataService: DataService,
    private faceApi: MsFaceApiService,
    private http: HttpClient,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  pageEvent: PageEvent;

  ngOnInit() {
    this.defaultPageSize = user_directory_params.userDirectoryDefaultPageSize;
    this.dataSource = new DataService(this.http, this.authService);

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
        err => console.log(err.error.error.code + ': ' + err.error.error.message)
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
    this.dataService
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
    const dialogRef = this.dialog.open(UserComponent, {
      width: '500px',
      data: null
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getUsers(this.search_event_log);
    });
  }

  onDeleteUser(user_id: number) {
    this.dataService.removeUser(user_id).subscribe(() => {
      this.getUsers();
    });
    // this.dataService.getUser(user_id).subscribe(
    //   user => {
    //     if (user.userPhotoFileId) {
    //       this.dataService.deleteFile(user.userPhotoFileId).subscribe(
    //         () => {
    //           this.faceApi
    //             .deletePersonFromPersonGroup(
    //               user.personGroupId,
    //               user.personId
    //             )
    //             .subscribe(
    //               () => {
    //                 this.dataService.removeUser(user_id).subscribe(
    //                   () => {
    //                     this.getUsers(this.search_event_log);
    //                   },
    //                   err => console.log(err.error.error.code + ': ' + err.error.error.message)
    //                 );
    //               },
    //               err => console.log(err.error.error.code + ': ' + err.error.error.message)
    //             );
    //         },
    //         err => console.log(err.error.error.code + ': ' + err.error.error.message)
    //       );
    //     } else {
    //       this.faceApi
    //         .deletePersonFromPersonGroup(
    //           user.personGroupId,
    //           user.personId
    //         )
    //         .subscribe(
    //           () => {
    //             this.dataService.removeUser(user_id).subscribe(
    //               () => {
    //                 this.getUsers(this.search_event_log);
    //               },
    //               err => console.log(err.error.error.code + ': ' + err.error.error.message)
    //             );
    //           },
    //           err => console.log(err.error.error.code + ': ' + err.error.error.message)
    //         );
    //     }
    //   },
    //   err => console.log(err.error.error.code + ': ' + err.error.error.message)
    // );
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
          return this.dataSource.getUsers(
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
      .subscribe(data => (this.users = data), err => console.log(err.error.error.code + ': ' + err.error.error.message));
  }


}
