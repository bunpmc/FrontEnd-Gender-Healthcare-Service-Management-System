import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-search-bar.component.html'
})
export class AppointmentSearchBarComponent {
  searchTerm: string = '';
  visitType: string = '';
  status: string = '';
  visitTypeOptions: string[] = ['consultation', 'follow-up']; // Adjust based on visit_type_enum
  statusOptions: string[] = ['pending', 'confirmed', 'cancelled']; // Adjust based on process_status

  @Output() filterChange = new EventEmitter<{ searchTerm: string; visitType: string; status: string }>();

  applyFilters() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      visitType: this.visitType,
      status: this.status
    });
  }
}
