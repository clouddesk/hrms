import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit {
  projects: [] = [];
  displayedColumns = ['id', 'name', 'location'];
  dataSource: DataService | null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataSource = new DataService(this.http, this.authService);
    this.getProjects();
  }

  getProjects() {
    this.dataService.getProjects().subscribe(
      result => {
        this.projects = result;
      },
      error => console.log(error)
    );
  }
}
