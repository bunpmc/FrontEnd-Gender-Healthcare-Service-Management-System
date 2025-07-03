import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-sidebar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="w-64 bg-white shadow flex flex-col py-6 h-full">
      <a routerLink="profile" routerLinkActive="bg-blue-100 font-bold"
         class="px-6 py-3 hover:bg-blue-50">Personal Profile</a>
      <a routerLink="consultant-meetings" routerLinkActive="bg-blue-100 font-bold"
         class="px-6 py-3 hover:bg-blue-50">Consultant Meetings</a>
      <a routerLink="patients" routerLinkActive="bg-blue-100 font-bold"
         class="px-6 py-3 hover:bg-blue-50">Patients</a>
      <a routerLink="blog-posts" routerLinkActive="bg-blue-100 font-bold"
         class="px-6 py-3 hover:bg-blue-50">Blog Posts</a>
      <a routerLink="slots" routerLinkActive="bg-blue-100 font-bold"
         class="px-6 py-3 hover:bg-blue-50">Slot Assignment</a>
      <a routerLink="appointments" routerLinkActive="bg-blue-100 font-bold"
         class="px-6 py-3 hover:bg-blue-50">My Appointments</a>
      <a routerLink="activity-logs" routerLinkActive="bg-blue-100 font-bold"
         class="px-6 py-3 hover:bg-blue-50">Activity Logs</a>
    </nav>
  `,
  styleUrl: './doctor-sidebar.component.css'
})
export class DoctorSidebarComponent {}
