import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-attendance-summary-report',
  templateUrl: './attendance-summary-report.component.html',
  styleUrls: ['./attendance-summary-report.component.scss']
})
export class AttendanceSummaryReportComponent implements OnInit {
  attendanceReportFilterForm: FormGroup;

  attendanceData = [];
  displayedColumns = [];
  dataSource: DataService | null;

  isLoadingResults = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.attendanceReportFilterForm = new FormGroup({
      inputFromDate: new FormControl(null),
      inputToDate: new FormControl(null)
    });
    this.dataSource = new DataService(this.http, this.authService);
  }

  getAttendanceSummaryReport() {
    this.isLoadingResults = true;
    let fromDate: Date = this.attendanceReportFilterForm.get('inputFromDate')
      .value;

    if (!fromDate) {
      fromDate = new Date(Date.now());
      fromDate.setHours(4, 0, 0, 0);
    } else {
      fromDate.setHours(fromDate.getHours() + 4);
    }
    let toDate: Date = this.attendanceReportFilterForm.get('inputToDate').value;

    if (!toDate) {
      toDate = new Date(Date.now());
      toDate.setDate(toDate.getDate() + 1);
      toDate.setHours(4, 0, 0, 0);
    } else {
      toDate.setHours(toDate.getHours() + 28);
    }
    this.dataService.getAttendaceSummary(fromDate, toDate).subscribe(
      result => {
        if (result.length > 1) {
          result.splice(0, 1);
        }
        this.displayedColumns = Object.keys(result[0]);
        this.attendanceData = result;
        this.isLoadingResults = false;
        console.log(result);
      },
      error => {
        console.log(error);
        this.isLoadingResults = false;
      }
    );
  }
}
