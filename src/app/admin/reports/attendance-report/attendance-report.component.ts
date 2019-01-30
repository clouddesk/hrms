import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_services/auth.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class AttendanceReportComponent implements OnInit {
  attendanceReportFilterForm: FormGroup;

  attendanceData: [] = [];
  displayedColumns = ['id', 'eventTypeId', 'employeeId', 'createdAt'];
  dataSource: DataService | null;

  isLoadingResults = false;

  projects = null;

  selectedValue: string;
  selectedLocation: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getProjects();
    this.attendanceReportFilterForm = new FormGroup({
      inputFromDate: new FormControl(null),
      inputToDate: new FormControl(null),
      inputProjectId: new FormControl(null, [Validators.required])
    });
    this.dataSource = new DataService(this.http, this.authService);
  }

  getProjects() {
    this.dataService.getProjects().subscribe(result => {
      this.projects = result;
    });
  }

  getColumnName(name: string) {
    if (name === 'employeeId') {
      return 'Employee Name';
    }
    if (name === 'id') {
      return 'ID';
    }
    if (name === 'createdAt') {
      return 'Registration Date/Time';
    }
    if (name === 'eventTypeId') {
      return 'Event Type';
    }
  }

  getAttendanceReport(project: HTMLInputElement) {
    const projectId: number = +project.value;
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
    this.dataService.getAttendace(fromDate, toDate, projectId).subscribe(
      result => {
        result.map(data => {
          const createdAt: Date = new Date(data.createdAt);
          const updatedAt: Date = new Date(data.updatedAt);
          data.createdAt = new Intl.DateTimeFormat('ka-GE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: 'Asia/Tbilisi'
          }).format(createdAt);
          data.updatedAt = new Intl.DateTimeFormat('ka-GE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: 'Asia/Tbilisi'
          }).format(updatedAt);
        });
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
