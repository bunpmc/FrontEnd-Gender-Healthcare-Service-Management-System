import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayAppointment } from '../../models/appointment.interface';

@Component({
  selector: 'app-appointment-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-table.component.html'
})
export class AppointmentTableComponent {
  @Input() paginatedAppointments: DisplayAppointment[] = [];
}
