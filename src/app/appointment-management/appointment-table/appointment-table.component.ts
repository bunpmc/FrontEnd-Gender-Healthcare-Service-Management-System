import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchBarComponent } from "../appointment-search-bar/appointment-search-bar.component";
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-appointment-table',
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './appointment-table.component.html',
  styleUrl: './appointment-table.component.css'
})
export class AppointmentTableComponent {
  // Trong component
  constructor(private supabaseService: SupabaseService) { }

  async loadAppointments() {
    try {
      const appointments = await this.supabaseService.getAllAppointments();
      console.log(appointments);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
