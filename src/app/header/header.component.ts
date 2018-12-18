import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menu: any;
  user: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  logout() {
    this.authService.logoutUser();
  }
}
