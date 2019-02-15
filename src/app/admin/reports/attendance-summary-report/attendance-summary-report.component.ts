import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/_services/project.service';
import { ReportService } from 'src/app/_services/report.service';

@Component({
  selector: 'app-attendance-summary-report',
  templateUrl: './attendance-summary-report.component.html',
  styleUrls: ['./attendance-summary-report.component.scss']
})
export class AttendanceSummaryReportComponent implements OnInit {
  attendanceReportFilterForm: FormGroup;

  attendanceData = [];
  displayedColumns = [];

  projects = null;

  isLoadingResults = false;

  constructor(
    private projectService: ProjectService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.getProjects();
    this.attendanceReportFilterForm = new FormGroup({
      inputFromDate: new FormControl(null),
      inputToDate: new FormControl(null),
      inputProjectId: new FormControl(null, [Validators.required])
    });
  }

  getProjects() {
    this.projectService.getProjects().subscribe(result => {
      this.projects = result;
    });
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
    const projectId: number = this.attendanceReportFilterForm.get(
      'inputProjectId'
    ).value;

    if (!toDate) {
      toDate = new Date(Date.now());
      toDate.setDate(toDate.getDate() + 1);
      toDate.setHours(4, 0, 0, 0);
    } else {
      toDate.setHours(toDate.getHours() + 28);
    }
    this.reportService
      .getAttendaceSummary(fromDate, toDate, projectId)
      .subscribe(
        result => {
          result.length > 0
            ? (this.displayedColumns = Object.keys(result[0]))
            : (this.displayedColumns = []);
          this.attendanceData = result;
          this.isLoadingResults = false;
        },
        error => {
          console.log(error);
          this.isLoadingResults = false;
        }
      );
  }
}
