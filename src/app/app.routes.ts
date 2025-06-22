import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PatientManagementComponent } from './patient-management/patient-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffManagementComponent } from './staff-management/staff-management.component';
import { AppointmentManagementComponent } from './appointment-management/appointment-management.component';
import { ServiceManagementComponent } from './service-management/service-management.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
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
