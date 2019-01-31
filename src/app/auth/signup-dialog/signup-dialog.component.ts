import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {
  signUpForm: FormGroup = new FormGroup({
    inputFirstName: new FormControl(null, [Validators.required]),
    inputLastName: new FormControl(null, [Validators.required]),
    inputEmail: new FormControl(null, [Validators.email, Validators.required]),
    inputPassword: new FormControl(null, [
      Validators.required,
      Validators.minLength(8)
    ]),
    inputPasswordCheck: new FormControl(null, [Validators.required]),
    inputCompanyId: new FormControl(null)
  });

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<SignupDialogComponent>
  ) {}

  ngOnInit() {}

  onSignUp() {
    this.authService
      .signupUser(
        this.signUpForm.get('inputFirstName').value,
        this.signUpForm.get('inputLastName').value,
        this.signUpForm.get('inputEmail').value,
        this.signUpForm.get('inputPassword').value,
        this.signUpForm.get('inputCompanyId').value
      )
      .then(() => this.dialogRef.close())
      .catch(error => {
        console.log(error);
        alert(error.error);
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
