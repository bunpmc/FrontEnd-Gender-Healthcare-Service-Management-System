import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../models/patient.interface';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent {
  @Input() patients: Patient[] = [];
  @Input() totalPatients: number = 0;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() searchQuery: string = ''; // Nhận searchQuery từ parent
  @Output() search = new EventEmitter<string>();
  @Output() addPatient = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

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

  goToNextPage() {
    const totalPages = Math.ceil((this.totalPatients || 0) / (this.itemsPerPage || 10));
    if (this.currentPage < totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onPageClick(page: number) {
    this.pageChange.emit(page);
  }

  onSearchEvent() {
    this.search.emit(this.searchQuery); // Phát ra giá trị searchQuery hiện tại
  }

  clearSearch() {
    this.search.emit(''); // Phát ra query rỗng để reset
  }

  onAddPatient() {
    this.addPatient.emit();
  }

  formatDate(date: string | undefined): string {
    if (!date) return '—';
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('vi-VN');
  }
}
