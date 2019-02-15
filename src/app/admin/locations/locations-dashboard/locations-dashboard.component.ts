import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { LocationService } from 'src/app/_services/location.service';

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

  constructor(
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.getLocations();
  }

  removeLocation(locationId: number) {
    this.locationService
      .removeLocation(locationId)
      .subscribe(() => this.getLocations(), error => console.log(error));
  }

  getLocations() {
    this.locationService.getLocations().subscribe(
      result => {
        this.locations = result;
      },
      error => console.log(error)
    );
  }
}
