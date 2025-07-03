import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-search-bar.component.html',
  styleUrls: ['./patient-search-bar.component.css']
})
export class PatientSearchBarComponent {
  searchQuery: string = '';
  genderFilter: string = '';
  statusFilter: string = '';

  genderOptions = ['male', 'female', 'other'];
  statusOptions = ['active', 'inactive'];

  @Output() filterChange = new EventEmitter<{ query: string; gender: string; status: string }>();
  @Output() addPatient = new EventEmitter<void>();

  applyFilters() {
    this.filterChange.emit({
      query: this.searchQuery.trim(),
      gender: this.genderFilter,
      status: this.statusFilter
    });
  }

  onAddPatient() {
    this.addPatient.emit();
  }
}
