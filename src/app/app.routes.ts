import { Routes } from '@angular/router';
import { PatientManagementComponent } from './patient-management/patient-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffManagementComponent } from './staff-management/staff-management.component';
import { AppointmentManagementComponent } from './appointment-management/appointment-management.component';
import { ServiceManagementComponent } from './service-management/service-management.component';
import { AnalyticManagementComponent } from './analytic-management/analytic-management.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'analytic',
    component: AnalyticManagementComponent
  },
  {
    path: 'patient',
    component: PatientManagementComponent
  },
  {
    path: 'staff',
    component: StaffManagementComponent
  },
  {
    path: 'appointment',
    component: AppointmentManagementComponent
  },
  {
    path: 'services',
    component: ServiceManagementComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  }
];
