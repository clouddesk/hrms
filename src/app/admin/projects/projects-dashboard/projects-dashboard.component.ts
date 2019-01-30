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
  locations = null;
  displayedColumns = ['id', 'name', 'location', 'actions'];
  dataSource: DataService | null;
  selectedLocation: number;

  projectActiveForEditing: number[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataSource = new DataService(this.http, this.authService);
    this.getLocations();
    this.getProjects();
  }

  containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  editProject(projectId: number) {
    if (!this.containsObject(projectId, this.projectActiveForEditing)) {
      this.projectActiveForEditing.push(projectId);
    }
  }

  saveProject(projectId: any, projectName: string, locationId: number) {
    this.dataService
      .editProject(projectId, { name: projectName, locationId: locationId })
      .subscribe(() => {
        this.getProjects();
        for (let i = 0; i < this.projectActiveForEditing.length; i++) {
          if (this.projectActiveForEditing[i] === projectId) {
            this.projectActiveForEditing.splice(i, 1);
          }
        }
      });
  }

  removeProject(projectId: number) {
    this.dataService
      .removeProject(projectId)
      .subscribe(() => this.getProjects(), error => console.log(error));
  }

  getLocations() {
    this.dataService.getLocations().subscribe(result => {
      this.locations = result;
    });
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
