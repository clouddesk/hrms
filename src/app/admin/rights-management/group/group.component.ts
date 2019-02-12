import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  groupForm: FormGroup;
  isLoading = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.groupForm = new FormGroup({
      inputName: new FormControl(null, [Validators.required]),
      inputDescription: new FormControl(null, [Validators.required]),
      inputLevel: new FormControl(null, [Validators.required]),
      inputState: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    const newGroup: Group = new Group(
      this.groupForm.get('inputName').value,
      this.groupForm.get('inputDescription').value,
      this.groupForm.get('inputLevel').value,
      this.groupForm.get('inputState').value
    );
    this.isLoading = true;
    this.dataService.addNewGroup(newGroup).subscribe(
      () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      err => {
        console.log(err.error);
      }
    );
  }
}
