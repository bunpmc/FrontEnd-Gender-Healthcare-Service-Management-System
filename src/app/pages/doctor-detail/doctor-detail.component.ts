import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorDetail } from '../../models/doctor.model';
import { UserService } from '../../Services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    NgClass,
    FormsModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './doctor-detail.component.html',
  // styleUrl: './doctor-detail.component.css', // nếu cần css thì mở dòng này
})
export class DoctorDetailComponent implements OnInit {
  doctor = signal<DoctorDetail | null>(null);
  loading = signal(true);
  errorMsg = signal('');
  activeTab = 'about';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  fallbackImage = 'https://via.placeholder.com/300x400?text=No+Image';

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll lên đầu trang khi vào detail
    const doctor_id = this.route.snapshot.paramMap.get('id');
    if (!doctor_id) {
      this.errorMsg.set('Không tìm thấy bác sĩ');
      this.loading.set(false);
      return;
    }
    this.fetchDoctor(doctor_id);
  }

  fetchDoctor(doctor_id: string): void {
    this.loading.set(true);
    this.errorMsg.set('');
    this.userService.getDoctorById(doctor_id).subscribe({
      next: (doctor) => {
        this.doctor.set(doctor);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Không thể tải dữ liệu bác sĩ');
        this.loading.set(false);
      },
    });
  }

  getImageUrl(link?: string | null): string {
    if (!link) return this.fallbackImage;
    return link.includes('//doctor')
      ? link.replace('//doctor', '/doctor')
      : link;
  }
  // --- GETTERS ---
  get doctorName(): string {
    return this.doctor()?.staff_members?.full_name || 'Dr. [unknown]';
  }

  get doctorAvatar(): string {
    const link = this.doctor()?.staff_members?.image_link;
    if (!link) return this.fallbackImage;
    return link.includes('//doctor')
      ? link.replace('//doctor', '/doctor')
      : link;
  }

  get staffLanguages(): string[] {
    return this.doctor()?.staff_members?.languages ?? [];
  }

  get educationDegrees() {
    return this.doctor()?.educations?.degrees ?? [];
  }

  get certificationList() {
    return this.doctor()?.certifications?.certifications ?? [];
  }

  get specialty(): string {
    return this.doctor()?.speciality?.replaceAll('_', ' ') ?? '';
  }

  get licenseNo(): string {
    return this.doctor()?.license_no ?? '';
  }

  get doctorBlogs() {
    return this.doctor()?.blogs ?? [];
  }

  // --- UI/UX Handler ---
  setTab(tab: string) {
    this.activeTab = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Optionally scroll to top when tab changes
  }

  backToList() {
    this.router.navigate(['/doctors']);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }
}
