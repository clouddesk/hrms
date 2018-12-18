import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AuthService } from '../_services/auth.service';

import { LoginDialogComponent } from '../auth/login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../auth/signup-dialog/signup-dialog.component';
import { MenuService } from '../_services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menu: any;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.menuService.getMenu().then(menu => {
      this.menu = menu;
    });
  }

  loginForm() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed();
  }

  signUpForm() {
    const dialogRef = this.dialog.open(SignupDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed();
  }
}
