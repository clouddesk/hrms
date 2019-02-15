import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { GroupService } from 'src/app/_services/group.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;

  groups = null;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      inputFirstName: new FormControl(null, [Validators.required]),
      inputLastName: new FormControl(null, [Validators.required]),
      inputEmail: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      inputUserGroupId: new FormControl(null),
      inputPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      inputPassword2: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
    this.getGroups();
  }

  onSubmit() {
    const newUser: User = new User(
      this.userForm.get('inputFirstName').value,
      this.userForm.get('inputLastName').value,
      this.userForm.get('inputEmail').value,
      this.userForm.get('inputUserGroupId').value,
      this.userForm.get('inputPassword').value
    );
    this.isLoading = true;
    this.userService.addNewUser(newUser).subscribe(
      () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      err => {
        console.log(err.error);
      }
    );
  }

  getGroups() {
    this.groupService.getAllGroups().subscribe(result => {
      this.groups = result;
    });
  }
}
