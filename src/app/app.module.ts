import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HrmsMaterialsModule } from './_materials/hrms-materials.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './_services/auth.service';
import { AuthGuard, SignUpGuard } from './_services/auth-guard.service';
import { DataService } from './_services/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { EmployeesComponent } from './employees/employees.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employees/employee/employee.component';
import { SignupDialogComponent } from './auth/signup-dialog/signup-dialog.component';
import { MenuService } from './_services/menu.service';
import { PostsComponent } from './employees/news/posts/posts.component';
import { EmployeeDirectoryComponent } from './employees/employee-directory/employee-directory.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { MsFaceApiService } from './_services/ms-face-api.service';
import { ClockComponent } from './attendance/clock/clock.component';

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
    PostsComponent,
    EmployeeDirectoryComponent,
    AttendanceComponent,
    ClockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HrmsMaterialsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [DataService, AuthService, AuthGuard, SignUpGuard, MenuService, MsFaceApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
