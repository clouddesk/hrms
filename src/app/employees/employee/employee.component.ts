import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Employee } from 'src/app/models/employee';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  // selectedFile: File = null;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<EmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: any
  ) {}

  ngOnInit() {
    if (this.employee) {
      this.employeeForm = new FormGroup({
        inputFirstName: new FormControl(this.employee.firstName, [
          Validators.required
        ]),
        inputLastName: new FormControl(this.employee.lastName, [
          Validators.required
        ]),
        inputPersonalId: new FormControl(this.employee.personalId, [
          Validators.required,
          Validators.minLength(11)
        ]),
        inputBirthDate: new FormControl(this.employee.birthDate, [
          Validators.required
        ]),
        inputMobilePhone: new FormControl(this.employee.mobilePhone, [
          Validators.required
        ])
      });
    } else {
      this.employeeForm = new FormGroup({
        inputFirstName: new FormControl(null, [Validators.required]),
        inputLastName: new FormControl(null, [Validators.required]),
        inputPersonalId: new FormControl(null, [
          Validators.required,
          Validators.minLength(11)
        ]),
        inputBirthDate: new FormControl(null, [Validators.required]),
        inputMobilePhone: new FormControl(null, [Validators.required])
      });
    }
  }

  onSave() {
    const changedEmployee: Employee = new Employee(
      this.employeeForm.get('inputFirstName').value,
      this.employeeForm.get('inputLastName').value,
      this.employeeForm.get('inputPersonalId').value,
      this.employeeForm.get('inputBirthDate').value,
      this.employeeForm.get('inputMobilePhone').value
    );
    if (this.employee) {
      this.dataService
        .editEmployee(this.employee.id, changedEmployee)
        .subscribe(
          () => {
            this.dialogRef.close();
          },
          err => console.log(err.error)
        );
    } else {
      this.dataService.addNewEmployee(changedEmployee).subscribe(
        () => {
          this.dialogRef.close();
        },
        err => console.log(err.error)
      );
    }
    // this.dataService.uploadFile(this.selectedFile).subscribe(response => {
    //   console.log(response);
    // }, err => console.log(err));
  }

  onDelete() {
    this.dataService.removeEmployee(this.employee.id).subscribe(() => {
      this.dialogRef.close();
    });
  }

  // onFileSelected(event) {
  //   this.selectedFile = <File>event.target.files[0];
  // }
}
