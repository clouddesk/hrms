import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projectForm: FormGroup;
  locations = null;

  // selectedValue: string;
  // selectedLocation: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSubmit() {
    const newProject = {
      projectName: this.projectForm.value.inputProjectName,
      locationId: this.projectForm.value.inputProjectLocationId
    };
    this.dataService.addProject(newProject).subscribe(() => {
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
    this.dataService.getLocations().subscribe(result => {
      this.locations = result;
    });
  }
}
