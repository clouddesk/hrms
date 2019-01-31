import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_services/auth-guard.service';

import { HomeComponent } from './home/home.component';

import { EmployeesComponent } from './employees/employees.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AdminComponent } from './admin/admin.component';
import { CompanyComponent } from './admin/company/company.component';
import { ProjectsComponent } from './admin/projects/projects.component';
import { ConfigComponent } from './admin/config/config.component';
import { MenuComponent } from './admin/config/menu/menu.component';
import { MenuItemComponent } from './admin/config/menu/menu-item/menu-item.component';
import { RightsManagementComponent } from './admin/rights-management/rights-management.component';
import { ProjectComponent } from './admin/projects/project/project.component';
import { LocationComponent } from './admin/locations/location/location.component';
import { LocationsComponent } from './admin/locations/locations.component';
import { LocationsDashboardComponent } from './admin/locations/locations-dashboard/locations-dashboard.component';
import { ProjectsDashboardComponent } from './admin/projects/projects-dashboard/projects-dashboard.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { AttendanceReportComponent } from './admin/reports/attendance-report/attendance-report.component';
import { UserDirectoryComponent } from './admin/rights-management/user-directory/user-directory.component';
// tslint:disable-next-line:max-line-length
import { RightsManagementDashboardComponent } from './admin/rights-management/rights-management-dashboard/rights-management-dashboard.component';
import { UserComponent } from './admin/rights-management/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'employee', component: EmployeesComponent, canActivate: [AuthGuard] },
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'config',
        component: ConfigComponent,
        children: [
          {
            path: 'menu',
            component: MenuComponent,
            children: [
              { path: 'add', component: MenuItemComponent },
              { path: 'edit', component: MenuItemComponent }
            ]
          }
        ]
      },
      {
        path: 'rights',
        component: RightsManagementComponent,
        children: [
          {
            path: 'users',
            children: [
              { path: 'add', component: UserComponent },
              { path: '', component: UserDirectoryComponent }
            ]
          },
          { path: '', component: RightsManagementDashboardComponent }
        ]
      },
      {
        path: 'company',
        component: CompanyComponent
      },
      {
        path: 'reports',
        component: ReportsComponent,
        children: [
          {
            path: 'attendance',
            component: AttendanceReportComponent
          }
        ]
      },
      {
        path: 'locations',
        component: LocationsComponent,
        children: [
          { path: 'add', component: LocationComponent },
          { path: '', component: LocationsDashboardComponent }
        ]
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        children: [
          { path: 'add', component: ProjectComponent },
          { path: '', component: ProjectsDashboardComponent }
        ]
      }
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
