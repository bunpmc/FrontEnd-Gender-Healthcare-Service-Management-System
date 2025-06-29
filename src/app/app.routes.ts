import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';
import { DoctorsPageComponent } from './pages/doctors-page/doctors-page.component';
import { BlogsPageComponent } from './pages/blogs-page/blogs-page.component';
import { DoctorDetailComponent } from './pages/doctor-detail/doctor-detail.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { ForgotPasswordComponent } from './pages/forget-password/forget-password.component';
import { ServicePageComponent } from './pages/services-page/services-page.component';
import { ConsultationPageComponent } from './pages/consultation-page/consultation-page.component';
import { LeaveAppointmentGuard } from './guards/leave-appointment.guard';
import { ServiceDetailComponent } from './service-detail/service-detail.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, data: { breadcrumb: 'Home' } },
  { path: 'login', component: LoginComponent },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'appointment',
    component: AppointmentPageComponent,
    data: { breadcrumb: 'Appointment' },
    canDeactivate: [LeaveAppointmentGuard],
  },
  {
    path: 'consultation',
    component: ConsultationPageComponent,
    data: { breadcrumb: 'consultation' },
  },
  {
    path: 'doctor',
    component: DoctorsPageComponent,
    data: { breadcrumb: 'Doctors' },
  },
  {
    path: 'doctor/:id',
    component: DoctorDetailComponent,
    data: { breadcrumb: '...' },
  }, // Will be replaced with Doctor's name dynamically
  {
    path: 'blog',
    component: BlogsPageComponent,
    data: { breadcrumb: 'Blogs' },
  },
  {
    path: 'blog/:id',
    component: BlogDetailComponent,
    data: { breadcrumb: '...' },
  },
  {
    path: 'service',
    component: ServicePageComponent,
    data: { breadcrumb: 'services' },
  },
  {
    path: 'service/:id',
    component: ServiceDetailComponent,
    data: { breadcrumb: '...' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
