import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SysObject } from 'src/app/models/sys-object';
import { SysObjectService } from 'src/app/_services/sys-object.service';

@Component({
  selector: 'app-sysobject',
  templateUrl: './sysobject.component.html',
  styleUrls: ['./sysobject.component.scss']
})
export class SysobjectComponent implements OnInit {
  sysObjectForm: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sysObjectService: SysObjectService
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
    this.sysObjectService.addNewSysObject(newSysObject).subscribe(
      () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      err => {
        console.log(err.error);
      }
    );
  }
}
