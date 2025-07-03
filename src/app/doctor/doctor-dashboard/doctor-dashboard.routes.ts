import { Routes } from '@angular/router';
import { DoctorProfileComponent } from './profile/profile.component';
import { ConsultantMeetingsComponent } from './consultant-meetings/consultant-meetings.component';
import { DoctorPatientsComponent } from './patients/patients.component';
import { BlogPostsComponent } from './blog-posts/blog-posts.component';
import { SlotAssignmentComponent } from './slots/slots.component';
import { DoctorAppointmentsComponent } from './appointments/appointments.component';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';

export const doctorDashboardRoutes: Routes = [
  { path: 'profile', component: DoctorProfileComponent },
  { path: 'consultant-meetings', component: ConsultantMeetingsComponent },
  { path: 'patients', component: DoctorPatientsComponent },
  { path: 'blog-posts', component: BlogPostsComponent },
  { path: 'slots', component: SlotAssignmentComponent },
  { path: 'appointments', component: DoctorAppointmentsComponent },
  { path: 'activity-logs', component: ActivityLogsComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];
