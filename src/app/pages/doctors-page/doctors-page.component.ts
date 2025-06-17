import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor.model';
import { UserService } from '../../Services/user.service';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-page',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, NgClass, FormsModule],
  templateUrl: './doctors-page.component.html',
  styleUrls: ['./doctors-page.component.css'], // optional nếu có CSS riêng
})
export class DoctorsPageComponent implements OnInit {
  // ===== STATE =====
  doctors: Doctor[] = [];
  paginatedDoctors: Doctor[] = [];
  loading = false;

  // ===== FILTERS =====
  searchValue: string = '';
  selectedSpecialty: string = 'All';
  selectedGender: string = 'All';
  specialties: string[] = ['All'];
  genders: string[] = ['All', 'male', 'female'];

  // ===== PAGINATION =====
  page = 1;
  perPage = 3;
  maxPage = 1;

  private userService = inject(UserService);

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.loading = true;

    const name = this.searchValue;
    const specialty =
      this.selectedSpecialty === 'All' ? '' : this.selectedSpecialty;
    const gender = this.selectedGender === 'All' ? '' : this.selectedGender;

    this.userService.getDoctors(name, specialty, gender).subscribe({
      next: (data) => {
        this.doctors = data;
        const uniqueSpecialties = Array.from(
          new Set(data.map((doc) => doc.speciality))
        );
        this.specialties = ['All', ...uniqueSpecialties];

        this.page = 1;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        alert('Không thể tải danh sách bác sĩ');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  showFilter: boolean = false;
  isDesktop: boolean = window.innerWidth >= 768;

  @HostListener('window:resize', [])
  onResize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  fallbackImage = 'https://via.placeholder.com/300x400?text=No+Image';

  getImageUrl(link: string | null): string {
    if (!link) return this.fallbackImage;
    return link.includes('//doctor')
      ? link.replace('//doctor', '/doctor')
      : link;
  }

  // ===== EVENT: Search by name =====
  onSearch(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value.trim();
    this.fetchDoctors();
  }

  // ===== EVENT: Select Specialty =====
  selectSpecialty(specialty: string): void {
    this.selectedSpecialty = specialty;
    this.fetchDoctors();
  }

  // ===== EVENT: Select Gender =====
  selectGender(gender: string): void {
    this.selectedGender = gender;
    this.fetchDoctors();
  }
  // ===== PAGINATION =====
  goToPage(pg: number): void {
    if (pg < 1 || pg > this.maxPage) return;
    this.page = pg;
    this.updatePagination();
  }

  updatePagination(): void {
    this.maxPage = Math.ceil(this.doctors.length / this.perPage);
    const start = (this.page - 1) * this.perPage;
    this.paginatedDoctors = this.doctors.slice(start, start + this.perPage);
  }

  get pageArray(): number[] {
    return Array.from({ length: this.maxPage }, (_, i) => i);
  }
}
