import { SupabaseService } from './../supabase.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientTableComponent } from './patient-table/patient-table.component';


@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [PatientTableComponent],
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.css']
})
export class PatientManagementComponent implements OnInit {
  patients: any[] = [];
  totalPatients = 0;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private router: Router, private SupabaseService: SupabaseService) { }

  async ngOnInit() {
    await this.loadPatients();
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }


  async loadPatients(query: string = '') {
    try {
      if (query.trim()) {
        // Search với cùng một query cho tất cả các fields
        this.patients = await this.SupabaseService.searchPatients(query, query, query);
      } else {
        // Load tất cả patients nếu không có query
        this.patients = await this.SupabaseService.getAllPatients();
      }
      this.totalPatients = this.patients.length;
      this.currentPage = 1;
    } catch (error) {
      console.error('Lỗi khi tải danh sách bệnh nhân:', error);
      this.patients = [];
      this.totalPatients = 0;
    }
  }

  async onSearch(query: string) {
    await this.loadPatients(query);
  }

  async onSearchEvent(query: string) {
    try {
      await this.loadPatients(query);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  }

  async onAddPatient() {
    // Ví dụ: tạo bệnh nhân với dữ liệu mẫu
    try {
      const newPatient = await this.SupabaseService.createPatient(
        crypto.randomUUID(),
        'New Patient',
        { food: ['peanuts'] },
        { conditions: ['diabetes'] },
        { surgeries: ['appendectomy'] },
        { vaccines: ['covid-19'] }
      );
      await this.loadPatients(); // Tải lại danh sách sau khi thêm
    } catch (error) {
      console.error('Lỗi thêm bệnh nhân:', error);
    }
  }
}
