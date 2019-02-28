import { Component, OnInit, ViewChild } from '@angular/core';
import { merge, of as observableOf, Subject } from 'rxjs';
import { MatSort, MatPaginator, PageEvent } from '@angular/material';
import { persongroup_directory_params } from 'src/environments/environment';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { FaceApiService } from 'src/app/_services/face.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-person-group-directory',
  templateUrl: './person-group-directory.component.html',
  styleUrls: ['./person-group-directory.component.scss']
})
export class PersonGroupDirectoryComponent implements OnInit {
  personGroups: [] = [];
  displayedColumns = ['name', 'actions'];
  defaultPageSize: string;

  personGroupActiveForEditing: string[] = [];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private route: ActivatedRoute, private faceApiService: FaceApiService) {}

  pageEvent: PageEvent;

  ngOnInit() {
    this.defaultPageSize =
      persongroup_directory_params.personGroupDirectoryDefaultPageSize;
    this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0),
      err => console.log(err.error.error.code + ': ' + err.error.error.message)
    );
    this.getPersonGroups();
  }

  viewPersonGroup(personGroupId: string) {
    this.router.navigate(['person', personGroupId], { relativeTo: this.route});
  }

  containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  editPersonGroup(personGroupId: string) {
    if (!this.containsObject(personGroupId, this.personGroupActiveForEditing)) {
      this.personGroupActiveForEditing.push(personGroupId);
    }
  }

  savePersonGroup(personGroupId: string, personGroupName: string) {
    this.faceApiService
      .editPersonGroup(personGroupId, personGroupName)
      .subscribe(() => {
        this.getPersonGroups();
        for (let i = 0; i < this.personGroupActiveForEditing.length; i++) {
          if (this.personGroupActiveForEditing[i] === personGroupId) {
            this.personGroupActiveForEditing.splice(i, 1);
          }
        }
      });
  }

  removePersonGroup(personGroupId: string) {
    this.faceApiService
      .deletePersonGroup(personGroupId)
      .subscribe(() => this.getPersonGroups(), error => console.log(error));
  }

  getPersonGroups() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const limit: string = this.paginator.pageSize
            ? this.paginator.pageSize.toString()
            : persongroup_directory_params.personGroupDirectoryDefaultPageSize;
          return this.faceApiService.listPersonGroups();
        }),
        map(data => {
          this.isLoadingResults = false;
          data = JSON.parse(data);
          this.resultsLength = data.length;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(
        data => {
          this.personGroups = data;
        },
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }
}
