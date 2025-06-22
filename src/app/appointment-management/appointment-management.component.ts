import { Component } from '@angular/core';
import { AppointmentTableComponent } from "./appointment-table/appointment-table.component";
import { SearchBarComponent } from './appointment-search-bar/appointment-search-bar.component';

@Component({
  selector: 'app-appointment-management',
  imports: [AppointmentTableComponent, SearchBarComponent],
  templateUrl: './appointment-management.component.html',
  styleUrls: ['./appointment-management.component.css']
})
export class AppointmentManagementComponent {
  filters = {
    searchTerm: '',
    selectedPatient: '',
    selectedStatus: '',
    selectedDate: ''
  };

  onFilterChange(filters: {
    searchTerm: string;
    selectedPatient: string;
    selectedStatus: string;
    selectedDate: string;
  }) {
    this.filters = filters;
  }
}
