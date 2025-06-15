import { Component } from '@angular/core';
import { AppointmentTableComponent } from "./appointment-table/appointment-table.component";
import { SearchBarComponent } from './appointment-search-bar/appointment-search-bar.component';

@Component({
  selector: 'app-appointment-management',
  imports: [AppointmentTableComponent, SearchBarComponent],
  templateUrl: './appointment-management.component.html',
  styleUrl: './appointment-management.component.css'
})
export class AppointmentManagementComponent {

}
