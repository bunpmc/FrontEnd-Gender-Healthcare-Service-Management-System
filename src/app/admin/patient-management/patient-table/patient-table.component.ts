import { Patient } from './../../../models/patient.interface';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent {
  @Input() paginatedPatients: Patient[] = [];
  @Input() totalPatients: number = 0;
  @Input() currentPage: number = 1;
  @Output() viewPatient = new EventEmitter<Patient>();
  @Output() editPatient = new EventEmitter<Patient>();
}
