import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-directory',
  templateUrl: './group-directory.component.html',
  styleUrls: ['./group-directory.component.scss']
})
export class GroupDirectoryComponent implements OnInit {
  groups = [];

  viewPermissions(id: number) {
    this.router.navigate(['./permission', id], { relativeTo: this.route });
  }

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataService.getAllGroups().subscribe(data => {
      this.groups = data;
    });
  }
}
