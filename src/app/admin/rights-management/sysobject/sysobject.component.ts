import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SysObject } from 'src/app/models/sys-object';

@Component({
  selector: 'app-sysobject',
  templateUrl: './sysobject.component.html',
  styleUrls: ['./sysobject.component.scss']
})
export class SysobjectComponent implements OnInit {
  sysObjectForm: FormGroup;
  isLoading = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sysObjectForm = new FormGroup({
      inputName: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    const newSysObject: SysObject = new SysObject(
      this.sysObjectForm.get('inputName').value
    );
    this.isLoading = true;
    this.dataService.addNewSysObject(newSysObject).subscribe(
      () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      err => {
        console.log(err.error);
      }
    );
  }
}
