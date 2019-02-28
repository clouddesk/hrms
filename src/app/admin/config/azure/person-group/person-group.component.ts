import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FaceApiService } from 'src/app/_services/face.service';

@Component({
  selector: 'app-person-group',
  templateUrl: './person-group.component.html',
  styleUrls: ['./person-group.component.scss']
})
export class PersonGroupComponent implements OnInit {
  personGroupForm: FormGroup;

  constructor(
    private faceApiService: FaceApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    const newPersonGroup = {
      personGroupId: this.personGroupForm.value.inputPersonGroupId,
      personGroupName: this.personGroupForm.value.inputPersonGroupName
    };
    this.faceApiService.createPersonGroup(newPersonGroup).subscribe(result => {
      console.log(result);
      this.router.navigate(['.'], { relativeTo: this.route.parent });
    });
  }

  ngOnInit() {
    this.personGroupForm = new FormGroup({
      inputPersonGroupId: new FormControl(null, Validators.required),
      inputPersonGroupName: new FormControl(null, Validators.required)
    });
  }
}
