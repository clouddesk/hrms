import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HrmsMaterialsModule } from './_materials/hrms-materials.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './_services/auth.service';
import { AuthGuard, SignUpGuard } from './_services/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FaceApiService } from './_services/face.service';
import { MapService } from './_services/map.service';

import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { EmployeesComponent } from './employees/employees.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employees/employee/employee.component';
import { SignupDialogComponent } from './auth/signup-dialog/signup-dialog.component';
import { MenuService } from './_services/menu.service';
import { EmployeeDirectoryComponent } from './employees/employee-directory/employee-directory.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { ClockComponent } from './attendance/clock/clock.component';
import { AdminComponent } from './admin/admin.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ConfigComponent } from './admin/config/config.component';
import { EmployeePhotoComponent } from './employees/employee-directory/employee-photo/employee-photo.component';
import { MenuComponent } from './admin/config/menu/menu.component';
import { MenuItemComponent } from './admin/config/menu/menu-item/menu-item.component';
import { CompanyComponent } from './admin/company/company.component';
import { RightsManagementComponent } from './admin/rights-management/rights-management.component';
import { ProjectsComponent } from './admin/projects/projects.component';
import { ProjectComponent } from './admin/projects/project/project.component';
import { LocationsComponent } from './admin/locations/locations.component';
import { LocationComponent } from './admin/locations/location/location.component';
import { LocationsDashboardComponent } from './admin/locations/locations-dashboard/locations-dashboard.component';
import { ProjectsDashboardComponent } from './admin/projects/projects-dashboard/projects-dashboard.component';
import { LocationMapComponent } from './admin/locations/locations-dashboard/location-map/location-map.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { AttendanceReportComponent } from './admin/reports/attendance-report/attendance-report.component';
// tslint:disable-next-line:max-line-length
import { RightsManagementDashboardComponent } from './admin/rights-management/rights-management-dashboard/rights-management-dashboard.component';
import { UserDirectoryComponent } from './admin/rights-management/user-directory/user-directory.component';
import { UserComponent } from './admin/rights-management/user/user.component';
import { GroupComponent } from './admin/rights-management/group/group.component';
import { PermissionComponent } from './admin/rights-management/permission/permission.component';
import { GroupDirectoryComponent } from './admin/rights-management/group-directory/group-directory.component';
import { SysobjectComponent } from './admin/rights-management/sysobject/sysobject.component';
import { SysobjectDirectoryComponent } from './admin/rights-management/sysobject-directory/sysobject-directory.component';
import { AttendanceSummaryReportComponent } from './admin/reports/attendance-summary-report/attendance-summary-report.component';
import { FileService } from './_services/file.service';
import { AttendanceService } from './_services/attendance.service';
import { EmployeeService } from './_services/employee.service';
import { GroupService } from './_services/group.service';
import { LocationService } from './_services/location.service';
import { PermissionService } from './_services/permission.service';
import { ProjectService } from './_services/project.service';
import { ReportService } from './_services/report.service';
import { SysObjectService } from './_services/sys-object.service';
import { UserService } from './_services/user.service';
import { CheckinImageComponent } from './admin/reports/attendance-report/checkin-image/checkin-image.component';
import { AzureComponent } from './admin/config/azure/azure.component';
import { AzureDashboardComponent } from './admin/config/azure/azure-dashboard/azure-dashboard.component';
import { PersonGroupDirectoryComponent } from './admin/config/azure/person-group-directory/person-group-directory.component';
import { PersonGroupComponent } from './admin/config/azure/person-group/person-group.component';
import { PersonDirectoryComponent } from './admin/config/azure/person-directory/person-directory.component';

@NgModule({
  entryComponents: [
    LoginDialogComponent,
    SignupDialogComponent,
    EmployeeComponent
  ],
  declarations: [
    AppComponent,
    LoginDialogComponent,
    EmployeesComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    EmployeeComponent,
    SignupDialogComponent,
    EmployeeDirectoryComponent,
    AttendanceComponent,
    ClockComponent,
    AdminComponent,
    ConfigComponent,
    EmployeePhotoComponent,
    MenuComponent,
    CompanyComponent,
    MenuItemComponent,
    ProjectsComponent,
    RightsManagementComponent,
    ProjectComponent,
    LocationsComponent,
    LocationComponent,
    LocationsDashboardComponent,
    ProjectsDashboardComponent,
    LocationMapComponent,
    ReportsComponent,
    AttendanceReportComponent,
    RightsManagementDashboardComponent,
    UserDirectoryComponent,
    UserComponent,
    GroupComponent,
    PermissionComponent,
    GroupDirectoryComponent,
    SysobjectComponent,
    SysobjectDirectoryComponent,
    AttendanceSummaryReportComponent,
    CheckinImageComponent,
    AzureComponent,
    AzureDashboardComponent,
    PersonGroupDirectoryComponent,
    PersonGroupComponent,
    PersonDirectoryComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HrmsMaterialsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule
  ],
  providers: [
    FileService,
    AttendanceService,
    EmployeeService,
    GroupService,
    LocationService,
    PermissionService,
    ProjectService,
    ReportService,
    SysObjectService,
    UserService,
    AuthService,
    AuthGuard,
    SignUpGuard,
    MenuService,
    FaceApiService,
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
