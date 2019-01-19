import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HrmsMaterialsModule } from './_materials/hrms-materials.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './_services/auth.service';
import { AuthGuard, SignUpGuard } from './_services/auth-guard.service';
import { DataService } from './_services/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MsFaceApiService } from './_services/ms-face-api.service';
import { GoogleMapsApiService } from './_services/google-maps-api.service';

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
    LayoutModule,
  ],
  providers: [DataService, AuthService, AuthGuard, SignUpGuard, MenuService, MsFaceApiService, GoogleMapsApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
