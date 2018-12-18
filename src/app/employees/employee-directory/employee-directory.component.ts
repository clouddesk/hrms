import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog
} from '@angular/material';
import { DataService } from 'src/app/_services/data.service';
import { EmployeeComponent } from '../employee/employee.component';



@Component({
  selector: 'app-employee-directory',
  templateUrl: './employee-directory.component.html',
  styleUrls: ['./employee-directory.component.scss']
})
export class EmployeeDirectoryComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  employees: any;

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'personalId',
    'birthDate',
    'mobilePhone',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.dataService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.dataSource = new MatTableDataSource(this.employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ViewEmployeeForm(i: number) {
    this.dataService.getEmployee(i).subscribe(employee => {
      const dialogRef = this.dialog.open(EmployeeComponent, {
        width: '500px',
        data: employee
      });
      dialogRef.afterClosed().subscribe(response => {
        this.fetchEmployees();
      });
    });
  }

  addEmployeeForm() {
    const dialogRef = this.dialog.open(EmployeeComponent, {
      width: '500px',
      data: null
    });
    dialogRef.afterClosed().subscribe(response => {
      this.fetchEmployees();
    });
  }

  onDeleteEmployee(employee_id: number) {
    this.dataService.removeEmployee(employee_id).subscribe(() => {
      this.fetchEmployees();
    });
  }
}
