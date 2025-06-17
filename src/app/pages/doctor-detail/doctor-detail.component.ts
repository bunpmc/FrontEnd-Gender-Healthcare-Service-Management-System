import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
})
export class DoctorDetailComponent implements OnInit {
  doctor = signal<DoctorDetail | null>(null);
  loading = signal(true);
  errorMsg = signal('');
  activeTab = 'about';

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  fallbackImage = 'https://via.placeholder.com/300x400?text=No+Image';

  ngOnInit(): void {
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

  // GETTERS
  get doctorName(): string {
    return this.doctor()?.staff_members?.full_name || 'Dr. [unknown]';
  }

  getImageUrl(link?: string | null): string {
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
}
