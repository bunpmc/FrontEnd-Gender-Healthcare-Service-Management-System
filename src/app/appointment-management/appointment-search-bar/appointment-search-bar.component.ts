import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-search-bar.component.html',
  styleUrls: ['./appointment-search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Output() filterChange = new EventEmitter<{
    searchTerm: string;
    selectedPatient: string;
    selectedStatus: string;
    selectedDate: string;
  }>();

  searchTerm = '';
  selectedPatient = '';
  selectedStatus = '';
  selectedDate = '';
  patients: { id: string; full_name: string }[] = [];

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    await this.loadPatients();
  }

  async loadPatients() {
    try {
      this.patients = await this.supabaseService.getPatientsAppointment();
    } catch (error) {
      console.error('Error loading patients:', error);
      this.patients = [];
    }
  }

  onSearch() {
    // Làm sạch searchTerm để tránh ký tự đặc biệt
    this.searchTerm = this.searchTerm.replace(/[%_]/g, '\\$&').trim();
    this.emitFilters();
  }

  onFilter() {
    this.emitFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedPatient = '';
    this.selectedStatus = '';
    this.selectedDate = '';
    this.emitFilters();
  }

  private emitFilters() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      selectedPatient: this.selectedPatient,
      selectedStatus: this.selectedStatus,
      selectedDate: this.selectedDate
    });
  }

}
