import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorSidebarComponent } from '../doctor-sidebar/doctor-sidebar.component';
import { DoctorHeaderComponent } from '../doctor-header/doctor-header.component';



@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, DoctorSidebarComponent, DoctorHeaderComponent, RouterModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})

export class DoctorDashboardComponent {}

