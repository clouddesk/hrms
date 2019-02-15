import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { LocationService } from 'src/app/_services/location.service';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projectForm: FormGroup;
  locations = null;

  constructor(
    private locationService: LocationService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSubmit() {
    const newProject = {
      projectName: this.projectForm.value.inputProjectName,
      locationId: this.projectForm.value.inputProjectLocationId
    };
    this.projectService.addProject(newProject).subscribe(() => {
      this.router.navigate(['.'], { relativeTo: this.route.parent });
    });
  }

  ngOnInit() {
    this.getLocations();
    this.projectForm = new FormGroup({
      inputProjectName: new FormControl(null, Validators.required),
      inputProjectLocationId: new FormControl(null, Validators.required)
    });
  }

  getLocations() {
    this.locationService.getLocations().subscribe(result => {
      this.locations = result;
    });
  }
}
