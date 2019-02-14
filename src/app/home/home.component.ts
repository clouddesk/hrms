import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AuthService } from '../_services/auth.service';

import { LoginDialogComponent } from '../auth/login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../auth/signup-dialog/signup-dialog.component';
import { MenuService } from '../_services/menu.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menu: any[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.menuService.getMenu().subscribe(menu => (this.menu = menu));
    }
  }

  loginForm() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.menuService.getMenu().subscribe(menu => (this.menu = menu));
      this.router.navigate(['/'], { relativeTo: this.route });
    });
  }

  signUpForm() {
    const dialogRef = this.dialog.open(SignupDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed();
  }
}
