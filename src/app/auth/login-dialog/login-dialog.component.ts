import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.component.html'
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    inputEmail: new FormControl(null, [Validators.email, Validators.required]),
    inputPassword: new FormControl(null, [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>
  ) {}

  ngOnInit() {}

  onLogin() {
    if (this.loginForm.valid) {
      this.authService
        .loginUser(
          this.loginForm.get('inputEmail').value,
          this.loginForm.get('inputPassword').value
        )
        .then(() => this.dialogRef.close())
        .catch(error => alert(error.error));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
