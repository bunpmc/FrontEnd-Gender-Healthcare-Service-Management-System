import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';

interface DoctorSlotAssignment {
  doctor_slot_id: string;
  slot_id: string;
  doctor_id: string;
  appointments_count: number;
  max_appointments: number;
  // Add more fields if needed from joined slot table
}

@Component({
  selector: 'app-slot-assignment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-xl font-bold mb-4">Slot Assignment</h2>
    <div *ngIf="isLoading">Loading...</div>
    <div *ngIf="!isLoading && assignments.length === 0">No slot assignments found.</div>
    <table *ngIf="!isLoading && assignments.length > 0" class="min-w-full bg-white shadow rounded">
      <thead>
        <tr>
          <th class="px-4 py-2">Slot ID</th>
          <th class="px-4 py-2">Appointments</th>
          <th class="px-4 py-2">Max Appointments</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let slot of assignments">
          <td class="px-4 py-2">{{ slot.slot_id }}</td>
          <td class="px-4 py-2">{{ slot.appointments_count }}</td>
          <td class="px-4 py-2">{{ slot.max_appointments }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class SlotAssignmentComponent implements OnInit {
  assignments: DoctorSlotAssignment[] = [];
  isLoading = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      // Replace with actual doctor_id from auth/session
      const doctor_id = 'YOUR_DOCTOR_ID';
      this.assignments = await this.supabase.getDoctorSlotAssignments(doctor_id);
    } catch (e) {
      this.assignments = [];
    } finally {
      this.isLoading = false;
    }
  }
}
