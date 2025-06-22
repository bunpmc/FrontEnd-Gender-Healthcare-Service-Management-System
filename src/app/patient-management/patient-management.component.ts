import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientTableComponent } from './patient-table/patient-table.component';
import { SupabaseService } from '../supabase.service';
import { Patient } from '../models/patient.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [PatientTableComponent, CommonModule],
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.css']
})
export class PatientManagementComponent implements OnInit {
  patients: Patient[] = [];
  totalPatients = 0;
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  errorMessage: string | null = null;
  searchQuery: string = ''; // Lưu trữ searchQuery trong parent

  constructor(private router: Router, private SupabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadPatients();
  }

  async loadPatients(query: string = '') {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const { patients, total } = query.trim()
        ? await this.SupabaseService.searchPatients(query, query, query, this.currentPage, this.itemsPerPage)
        : await this.SupabaseService.getPatients(this.currentPage, this.itemsPerPage);
      this.patients = patients;
      this.totalPatients = total;
    } catch (error) {
      this.errorMessage = 'Failed to load patients. Please try again.';
      this.patients = [];
      this.totalPatients = 0;
    } finally {
      this.isLoading = false;
    }
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadPatients(this.searchQuery); // Truyền searchQuery khi đổi trang
  }

  onSearchEvent(query: string) {
    this.searchQuery = query; // Cập nhật searchQuery
    this.loadPatients(query);
  }

  onAddPatient() {
    this.router.navigate(['/add-patient']);
  }
}
