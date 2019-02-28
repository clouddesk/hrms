import { Component, OnInit } from '@angular/core';
import { FaceApiService } from 'src/app/_services/face.service';
import { person_directory_params } from 'src/environments/environment';
import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-person-directory',
  templateUrl: './person-directory.component.html',
  styleUrls: ['./person-directory.component.scss']
})
export class PersonDirectoryComponent implements OnInit {
  personGroupId = null;
  displayedColumns = ['name', 'faces', 'actions'];
  defaultPageSize: string;
  dataSource;

  resultsLength = 0;
  isLoadingResults = true;

  constructor(
    private faceApiService: FaceApiService,
    private route: ActivatedRoute
  ) {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.personGroupId = this.route.snapshot.params.id;
    this.defaultPageSize =
      person_directory_params.personDirectoryDefaultPageSize;
    this.getPersons();
  }

  removePerson(personId: string) {
    this.faceApiService
      .deletePersonFromPersonGroup(this.personGroupId, personId)
      .subscribe(() => this.getPersons(), error => console.log(error));
  }

  removeFaceFromPerson(personId: string, persistedFaceId: string) {
    this.faceApiService
      .deleteFaceOfAPerson(this.personGroupId, personId, persistedFaceId)
      .subscribe(() => this.getPersons());
  }
  getPersons() {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.faceApiService.listPersonOfPersonGroup(
            this.personGroupId
          );
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
          this.dataSource = new MatTableDataSource(data);
        },
        err =>
          console.log(err.error.error.code + ': ' + err.error.error.message)
      );
  }
}
