import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Patient {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  gender?: string;
  dob?: string;
  allergies?: object | null;
  chronic_conditions?: object | null;
  past_surgeries?: object | null;
  vaccination_status?: object | null;
  patient_status: string;
  created_at?: string;
}

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent {
  @Input() patients: Patient[] = [];
  @Input() totalPatients: number = 0;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10; // để test
  @Output() search = new EventEmitter<string>();
  @Output() addPatient = new EventEmitter<void>();

  get paginatedPatients(): Patient[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.patients.slice(startIndex, endIndex);
  }

  getDisplayRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalPatients || 0);
    return { start, end };
  }

  getPages(): number[] {
    const totalPages = Math.ceil((this.totalPatients || 0) / (this.itemsPerPage || 10));
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  @Output() pageChange = new EventEmitter<number>();

  goToNextPage() {
    const totalPages = Math.ceil((this.totalPatients || 0) / (this.itemsPerPage || 10));
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  onPageClick(page: number) {
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }

  onSearchEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.search.emit(target.value);
    }
  }

  onAddPatient() {
    this.addPatient.emit();
  }
}
