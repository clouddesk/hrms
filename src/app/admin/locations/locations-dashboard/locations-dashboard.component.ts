import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-locations-dashboard',
  templateUrl: './locations-dashboard.component.html',
  styleUrls: ['./locations-dashboard.component.scss']
})
export class LocationsDashboardComponent implements OnInit {
  locations: [] = [];
  displayedColumns = ['id', 'name', 'address'];
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

  getLocations() {
    this.dataService.getLocations().subscribe(
      result => {
        this.locations = result;
      },
      error => console.log(error)
    );
  }
}
