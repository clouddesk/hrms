import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';
import { LocationService } from 'src/app/_services/location.service';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit {
  projects: [] = [];
  locations = null;
  displayedColumns = ['id', 'name', 'location', 'actions'];
  selectedLocation: number;

  projectActiveForEditing: number[] = [];

  constructor(
    private projectService: ProjectService,
    private locationService: LocationService,
  ) {}

  ngOnInit() {
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
    this.projectService
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
    this.projectService
      .removeProject(projectId)
      .subscribe(() => this.getProjects(), error => console.log(error));
  }

  getLocations() {
    this.locationService.getLocations().subscribe(result => {
      this.locations = result;
    });
  }

  getProjects() {
    this.projectService.getProjects().subscribe(
      result => {
        this.projects = result;
      },
      error => console.log(error)
    );
  }
}
