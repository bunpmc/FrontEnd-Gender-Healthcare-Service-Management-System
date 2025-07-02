import { Routes } from '@angular/router';
import { PatientManagementComponent } from './admin/patient-management/patient-management.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { StaffManagementComponent } from './admin/staff-management/staff-management.component';
import { AppointmentManagementComponent } from './admin/appointment-management/appointment-management.component';
import { ServiceManagementComponent } from './admin/service-management/service-management.component';
import { AnalyticManagementComponent } from './admin/analytic-management/analytic-management.component';
import { DoctorDashboardComponent } from './doctor/doctor-dashboard/doctor-dashboard.component';

export const routes: Routes = [
  {
    path: 'admin/dashboard',
    component: DashboardComponent
  },
  {
    path: 'admin/analytic',
    component: AnalyticManagementComponent
  },
  {
    path: 'admin/patient',
    component: PatientManagementComponent
  },
  {
    path: 'admin/staff',
    component: StaffManagementComponent
  },
  {
    path: 'admin/appointment',
    component: AppointmentManagementComponent
  },
  {
    path: 'admin/services',
    component: ServiceManagementComponent
  },
  {
    path: 'doctor/dashboard',
    component: DoctorDashboardComponent
  },
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard',
  },
];
