import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface PhoneRegion {
  code: string;
  flag: string;
  name: string;
  dialCode: string;
  format: string;
  placeholder: string;
}

interface BookingState {
  type?: 'docfirst' | 'serfirst';
  fullName?: string;
  email?: string;
  phone?: string;
  phoneRegion?: string;
  gender?: 'male' | 'female' | 'other';
  message?: string;
  doctor_id?: string;
  service_id?: string;
  preferred_date?: string;
  preferred_time?: string;
  preferred_slot_id?: string;
  schedule?: 'Morning' | 'Afternoon' | 'Evening'; // Added schedule property
}

interface Doctor {
  doctor_id: string;
  full_name: string;
  specialization?: string;
  services?: string[]; // Array of service IDs the doctor provides
}

interface Service {
  service_id: string;
  name: string;
  description?: string;
}

interface TimeSlot {
  doctor_slot_id: string;
  slot_date: string;
  slot_time: string;
  doctor_id: string;
}

@Component({
  selector: 'app-appointmentPage',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.css'],
})
export class AppointmentPageComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Component state
  currentStep: number = 1;
  bookingType: 'docfirst' | 'serfirst' | null = null;
  formSubmitted: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  doctorSort: 'name' | 'specialization' = 'name';

  // Data
  booking: BookingState = {};
  doctors: Doctor[] = [];
  services: Service[] = [];
  availableDoctors: Doctor[] = [];
  availableSlots: TimeSlot[] = [];

  // Phone regions
  phoneRegions: PhoneRegion[] = [
    {
      code: 'VN',
      flag: '🇻🇳',
      name: 'Vietnam',
      dialCode: '+84',
      format: 'XXX XXX XXX',
      placeholder: '901 234 567',
    },
    {
      code: 'US',
      flag: '🇺🇸',
      name: 'United States',
      dialCode: '+1',
      format: '(XXX) XXX-XXXX',
      placeholder: '(555) 123-4567',
    },
    {
      code: 'GB',
      flag: '🇬🇧',
      name: 'United Kingdom',
      dialCode: '+44',
      format: 'XXXX XXX XXX',
      placeholder: '7911 123456',
    },
    {
      code: 'AU',
      flag: '🇦🇺',
      name: 'Australia',
      dialCode: '+61',
      format: 'XXX XXX XXX',
      placeholder: '412 345 678',
    },
    {
      code: 'CA',
      flag: '🇨🇦',
      name: 'Canada',
      dialCode: '+1',
      format: '(XXX) XXX-XXXX',
      placeholder: '(555) 123-4567',
    },
  ];

  selectedPhoneRegion: PhoneRegion = this.phoneRegions[0];
  selectedDoctor: Doctor | null = null;

  // Computed properties
  get progressWidth(): string {
    const steps = this.bookingType === 'serfirst' ? 5 : 4;
    return `${(this.currentStep / steps) * 100}%`;
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadBookingState();
    this.fetchDoctors();
    this.fetchServices();
    if (this.booking.phoneRegion) {
      const savedRegion = this.phoneRegions.find(
        (r) => r.code === this.booking.phoneRegion
      );
      if (savedRegion) {
        this.selectedPhoneRegion = savedRegion;
      }
    }
  }

  // Navigation methods
  chooseBookingType(type: 'docfirst' | 'serfirst'): void {
    this.bookingType = type;
    this.booking.type = type;
    this.currentStep = 2;
    this.errorMessage = null;
    this.saveBookingState();
  }

  backStep2(): void {
    this.currentStep = 1;
    this.bookingType = null;
    this.booking.type = undefined;
    this.saveBookingState();
  }

  backStep3(): void {
    this.currentStep = 2;
    this.formSubmitted = false;
    this.errorMessage = null;
  }

  backFromDoctorSelection(): void {
    if (this.bookingType === 'serfirst') {
      this.currentStep = 3;
      this.booking.doctor_id = undefined;
      this.availableDoctors = [];
      this.availableSlots = [];
    } else {
      this.currentStep = 2;
    }
    this.formSubmitted = false;
    this.errorMessage = null;
  }

  backFromScheduleSelection(): void {
    this.currentStep = this.bookingType === 'serfirst' ? 4 : 3;
    this.booking.preferred_date = undefined;
    this.booking.preferred_time = undefined;
    this.booking.preferred_slot_id = undefined;
    this.availableSlots = [];
    this.formSubmitted = false;
    this.errorMessage = null;
  }

  goToDoctorSelection(): void {
    if (!this.booking.service_id) {
      this.formSubmitted = true;
      this.errorMessage = 'Please select a service.';
      this.scrollToFirstError();
      return;
    }
    this.currentStep = 4;
    this.fetchDoctorsByService();
  }

  goToScheduleSelection(): void {
    if (!this.booking.doctor_id) {
      this.formSubmitted = true;
      this.errorMessage = 'Please select a doctor.';
      this.scrollToFirstError();
      return;
    }
    this.currentStep = this.bookingType === 'serfirst' ? 5 : 4;
    this.fetchAvailableSlots();
  }

  submitStep2(form: NgForm): void {
    this.formSubmitted = true;
    this.errorMessage = null;

    if (this.isFormValidStep2(form)) {
      this.currentStep = this.bookingType === 'serfirst' ? 3 : 3;
      this.formSubmitted = false;
      if (this.bookingType === 'serfirst') {
        // No need to fetch services here as they are already loaded
      } else {
        this.availableDoctors = [...this.doctors];
      }
      this.saveBookingState();
    } else {
      this.scrollToFirstError();
    }
  }

  submitStep3(form: NgForm): void {
    this.formSubmitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (
      form.valid &&
      this.isTimeValid() &&
      (this.bookingType !== 'docfirst' || this.booking.service_id)
    ) {
      const selectedSlot = this.availableSlots.find(
        (slot) => slot.slot_time === this.booking.preferred_time
      );
      this.booking.preferred_slot_id = selectedSlot?.doctor_slot_id;
      this.booking.schedule = this.inferSchedule(this.booking.preferred_time!);

      const phoneForApi = this.getFullPhoneNumber();

      const payload = {
        fullName: this.booking.fullName,
        email: this.booking.email || undefined,
        phone: phoneForApi,
        gender: this.booking.gender || 'other',
        schedule: this.booking.schedule,
        message: this.booking.message,
        doctor_id: this.booking.doctor_id,
        service_id: this.booking.service_id,
        preferred_date: this.booking.preferred_date,
        preferred_time: this.booking.preferred_time,
        preferred_slot_id: this.booking.preferred_slot_id,
        visit_type: 'consultation',
      };

      this.http
        .post(
          'https://xzxxodxplyetecrsbxmc.supabase.co/functions/v1/book-appointment',
          payload
        )
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              this.successMessage = response.message;
              this.resetForm();
              this.router.navigate(['/confirmation'], {
                state: {
                  appointment: response.data.appointment,
                  slot_info: response.data.slot_info,
                },
              });
            } else {
              this.errorMessage =
                response.error || 'Failed to book appointment';
              if (response.details?.available_slots) {
                this.availableSlots = response.details.available_slots.map(
                  (slot: any) => ({
                    doctor_slot_id: slot.slot_id,
                    slot_date: slot.date,
                    slot_time: slot.time,
                    doctor_id: this.booking.doctor_id,
                  })
                );
              }
            }
          },
          error: (err) => {
            this.errorMessage =
              err.error?.error ||
              'Failed to book appointment. Please check your phone number format.';
            if (err.error?.details?.available_slots) {
              this.availableSlots = err.error.details.available_slots.map(
                (slot: any) => ({
                  doctor_slot_id: slot.slot_id,
                  slot_date: slot.date,
                  slot_time: slot.time,
                  doctor_id: this.booking.doctor_id,
                })
              );
            }
          },
        });
    } else {
      this.errorMessage = 'Please complete all required fields.';
      this.scrollToFirstError();
    }
  }

  // Selection methods
  selectService(service: Service): void {
    this.booking.service_id = service.service_id;
    this.saveBookingState();
  }

  selectDoctor(doctor: Doctor): void {
    this.booking.doctor_id = doctor.doctor_id;
    this.selectedDoctor = doctor;
    if (this.bookingType === 'serfirst') {
      this.goToScheduleSelection();
    }
    this.saveBookingState();
  }

  selectTime(slot: TimeSlot): void {
    this.booking.preferred_time = slot.slot_time;
    this.booking.preferred_slot_id = slot.doctor_slot_id;
    this.saveBookingState();
  }

  sortDoctors(): void {
    this.availableDoctors = [...this.availableDoctors].sort((a, b) => {
      if (this.doctorSort === 'name') {
        return a.full_name.localeCompare(b.full_name);
      } else {
        return (a.specialization || '').localeCompare(b.specialization || '');
      }
    });
  }

  // Phone number handling
  onPhoneRegionChange(regionCode: string): void {
    const region = this.phoneRegions.find((r) => r.code === regionCode);
    if (region) {
      this.selectedPhoneRegion = region;
      this.booking.phoneRegion = regionCode;
      this.booking.phone = '';
      this.saveBookingState();
    }
  }

  formatPhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const phone = input.value;
    if (!phone) {
      this.booking.phone = '';
      return;
    }

    let cleanedPhone = phone.replace(/\D/g, '');

    switch (this.selectedPhoneRegion.code) {
      case 'VN':
        cleanedPhone = this.formatVietnamesePhone(cleanedPhone);
        break;
      case 'US':
      case 'CA':
        cleanedPhone = this.formatNorthAmericanPhone(cleanedPhone);
        break;
      case 'GB':
        cleanedPhone = this.formatUKPhone(cleanedPhone);
        break;
      case 'AU':
        cleanedPhone = this.formatAustralianPhone(cleanedPhone);
        break;
    }

    this.booking.phone = cleanedPhone;
    this.saveBookingState();
  }

  private formatVietnamesePhone(digits: string): string {
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    if (digits.startsWith('84')) {
      digits = digits.substring(2);
    }
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6,
        9
      )}`;
    }
  }

  private formatNorthAmericanPhone(digits: string): string {
    if (digits.startsWith('1')) {
      digits = digits.substring(1);
    }
    if (digits.length <= 3) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }
  }

  private formatUKPhone(digits: string): string {
    if (digits.startsWith('44')) {
      digits = digits.substring(2);
    }
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(
        7,
        10
      )}`;
    }
  }

  private formatAustralianPhone(digits: string): string {
    if (digits.startsWith('61')) {
      digits = digits.substring(2);
    }
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6,
        9
      )}`;
    }
  }

  getFullPhoneNumber(): string {
    if (!this.booking.phone) return '';
    const digits = this.booking.phone.replace(/\D/g, '');
    switch (this.selectedPhoneRegion.code) {
      case 'VN':
        return `+84${digits}`;
      case 'US':
      case 'CA':
        return `+1${digits}`;
      case 'GB':
        return `+44${digits}`;
      case 'AU':
        return `+61${digits}`;
      default:
        return `${this.selectedPhoneRegion.dialCode}${digits}`;
    }
  }

  // Validation methods
  isPhoneValid(): boolean {
    if (!this.booking.phone) {
      return false;
    }
    const digits = this.booking.phone.replace(/\D/g, '');
    switch (this.selectedPhoneRegion.code) {
      case 'VN':
        return digits.length >= 9 && digits.length <= 10;
      case 'US':
      case 'CA':
        return digits.length === 10;
      case 'GB':
        return digits.length >= 10 && digits.length <= 11;
      case 'AU':
        return digits.length === 9;
      default:
        return digits.length >= 7 && digits.length <= 15;
    }
  }

  isTimeValid(): boolean {
    if (!this.booking.preferred_time) return false;
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:00$/;
    return timeRegex.test(this.booking.preferred_time);
  }

  private isFormValidStep2(form: NgForm): boolean {
    const hasValidPhone = this.isPhoneValid();
    const hasFullName = !!this.booking.fullName?.trim();
    const hasMessage = !!this.booking.message?.trim();
    const hasValidEmail = !this.booking.email || this.isEmailValid();
    return (
      (form.valid ?? false) &&
      hasValidPhone &&
      hasFullName &&
      hasMessage &&
      hasValidEmail
    );
  }

  private isEmailValid(): boolean {
    if (!this.booking.email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.booking.email);
  }

  // Data fetching methods
  fetchDoctors(): void {
    this.http
      .get<Doctor[]>(
        'https://xzxxodxplyetecrsbxmc.supabase.co/functions/v1/fetch-doctor'
      )
      .subscribe({
        next: (data) => {
          this.doctors = data;
          this.availableDoctors = data;
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch doctors';
          console.error(err);
        },
      });
  }

  fetchServices(): void {
    this.http
      .get<Service[]>(
        'https://xzxxodxplyetecrsbxmc.supabase.co/functions/v1/fetch-service'
      )
      .subscribe({
        next: (data) => {
          this.services = data;
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch services';
          console.error(err);
        },
      });
  }

  fetchDoctorsByService(): void {
    if (!this.booking.service_id) return;
    this.http
      .post<Doctor[]>(
        'https://xzxxodxplyetecrsbxmc.supabase.co/functions/v1/fetch-doctor',
        { service_id: this.booking.service_id }
      )
      .subscribe({
        next: (data) => {
          this.availableDoctors = data;
          this.booking.doctor_id = undefined;
          this.availableSlots = [];
          this.sortDoctors();
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch doctors for service';
          console.error(err);
        },
      });
  }

  fetchAvailableSlots(): void {
    if (!this.booking.doctor_id || !this.booking.preferred_date) return;
    this.http
      .post<TimeSlot[]>(
        'https://xzxxodxplyetecrsbxmc.supabase.co/functions/v1/get-available-slots',
        {
          p_doctor_id: this.booking.doctor_id,
          p_slot_date: this.booking.preferred_date,
          p_start_time: '00:00:00',
          p_end_time: '23:59:59',
          p_slot_id: null,
        }
      )
      .subscribe({
        next: (data) => {
          this.availableSlots = data;
          this.booking.preferred_time = undefined;
          this.booking.preferred_slot_id = undefined;
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch available slots';
          console.error(err);
        },
      });
  }

  // Utility methods
  private inferSchedule(time: string): 'Morning' | 'Afternoon' | 'Evening' {
    const [hour] = time.split(':').map(Number);
    if (hour >= 8 && hour < 13) return 'Morning';
    if (hour >= 13 && hour < 18) return 'Afternoon';
    return 'Evening';
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const errorElement = document.querySelector('.border-red-400');
      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  }

  // Local storage methods
  private loadBookingState(): void {
    try {
      const saved = localStorage.getItem('bookingState');
      if (saved) {
        this.booking = JSON.parse(saved);
        if (this.booking.type) {
          this.bookingType = this.booking.type;
          this.currentStep = 2;
        }
      }
    } catch (error) {
      console.error('Error loading booking state:', error);
      this.booking = {};
      this.currentStep = 1;
    }
  }

  private saveBookingState(): void {
    try {
      this.booking.phoneRegion = this.selectedPhoneRegion.code;
      localStorage.setItem('bookingState', JSON.stringify(this.booking));
    } catch (error) {
      console.error('Error saving booking state:', error);
    }
  }

  hasBookingData(): boolean {
    return !!(
      this.booking.type ||
      this.booking.fullName ||
      this.booking.email ||
      this.booking.phone ||
      this.booking.gender ||
      this.booking.message ||
      this.booking.doctor_id ||
      this.booking.service_id ||
      this.booking.preferred_date ||
      this.booking.preferred_time ||
      this.booking.preferred_slot_id ||
      this.booking.schedule
    );
  }

  resetForm(): void {
    this.booking = {};
    this.currentStep = 1;
    this.bookingType = null;
    this.formSubmitted = false;
    this.errorMessage = null;
    this.successMessage = null;
    this.selectedPhoneRegion = this.phoneRegions[0];
    this.availableDoctors = [];
    this.availableSlots = [];
    this.selectedDoctor = null;
    localStorage.removeItem('bookingState');
  }

  goHome(event: Event): void {
    event.preventDefault();
    if (this.hasBookingData()) {
      const confirmLeave = window.confirm(
        'Bạn có chắc muốn rời khỏi trang đặt lịch? Dữ liệu sẽ bị xóa!'
      );
      if (confirmLeave) {
        this.resetForm();
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
