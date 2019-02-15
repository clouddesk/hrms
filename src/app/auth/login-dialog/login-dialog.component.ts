import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
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
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService
        .loginUser(
          this.loginForm.get('inputEmail').value,
          this.loginForm.get('inputPassword').value
        )
        .then(() => this.dialogRef.close())
        .catch(error => this.openSnackBar(error.error));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
