import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-search-bar.component.html',
  styleUrls: ['./appointment-search-bar.component.css']
})
export class SearchBarComponent {
  @Output() filterChange = new EventEmitter<{
    searchTerm: string;
    selectedDoctor: string;
    selectedPatient: string;
    selectedDate: string;
  }>();

  searchTerm = '';
  selectedDoctor = '';
  selectedPatient = '';
  selectedDate = '';

  staffMembers = [
    { staff_id: '123e4567-e89b-12d3-a456-426614174000', full_name: 'John Smith' },
    { staff_id: '123e4567-e89b-12d3-a456-426614174001', full_name: 'Jane Doe' }
  ];

  patients = [
    { id: '550e8400-e29b-41d4-a716-446655440002', full_name: 'Alice Johnson' },
    { id: '550e8400-e29b-41d4-a716-446655440004', full_name: 'Bob Wilson' }
  ];

  onSearch() {
    this.emitFilters();
  }

  onFilter() {
    this.emitFilters();
  }

  private emitFilters() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      selectedDoctor: this.selectedDoctor,
      selectedPatient: this.selectedPatient,
      selectedDate: this.selectedDate
    });
  }
}
