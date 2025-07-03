import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';

interface DoctorAppointment {
  appointment_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_status: string;
  visit_type: string;
}

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="text-2xl font-bold mb-6">My Appointments</h2>
      <div *ngIf="isLoading" class="text-gray-500">Loading...</div>
      <div *ngIf="!isLoading && appointments.length === 0" class="text-gray-500">No appointments found.</div>
      <div *ngIf="!isLoading && appointments.length > 0">
        <table class="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Patient</th>
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-left">Visit Type</th>
              <th class="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let appt of appointments">
              <td class="px-4 py-2">{{ appt.patient_name }}</td>
              <td class="px-4 py-2">{{ appt.appointment_date | date:'short' }}</td>
              <td class="px-4 py-2">{{ appt.visit_type }}</td>
              <td class="px-4 py-2">
                <span [ngClass]="{
                  'text-green-600': appt.appointment_status === 'completed',
                  'text-yellow-600': appt.appointment_status === 'pending',
                  'text-red-600': appt.appointment_status === 'cancelled'
                }">{{ appt.appointment_status | titlecase }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: DoctorAppointment[] = [];
  isLoading = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      // Replace with actual doctor_id from auth/session
      const doctor_id = 'YOUR_DOCTOR_ID';
      this.appointments = await this.supabase.getAppointmentsByDoctor(doctor_id);
    } catch {
      this.appointments = [];
    } finally {
      this.isLoading = false;
    }
  }
}
