import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientManagementComponent } from './patient-management/patient-management.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    CommonModule,
    HeaderComponent,
    SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'healthcare';
}
