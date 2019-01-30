import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_services/auth.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-locations-dashboard',
  templateUrl: './locations-dashboard.component.html',
  styleUrls: ['./locations-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class LocationsDashboardComponent implements OnInit {
  locations: [] = [];
  displayedColumns = ['id', 'name', 'address', 'actions'];
  dataSource: DataService | null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataSource = new DataService(this.http, this.authService);
    this.getLocations();
  }

  removeLocation(locationId: number) {
    this.dataService
      .removeLocation(locationId)
      .subscribe(() => this.getLocations(), error => console.log(error));
  }

  getLocations() {
    this.dataService.getLocations().subscribe(
      result => {
        this.locations = result;
      },
      error => console.log(error)
    );
  }
}
