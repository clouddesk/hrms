import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/_services/group.service';

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
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.groupService.getAllGroups().subscribe(data => {
      this.groups = data;
    });
  }
}
