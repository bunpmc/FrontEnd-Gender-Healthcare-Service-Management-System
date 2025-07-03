// ================== IMPORTS ==================
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { type UserLogin, type UserRegister } from '../models/user.model';
import { type Doctor, type DoctorDetail } from '../models/doctor.model';

import { Observable } from 'rxjs';
import { type Blog, type BlogDetail } from '../models/blog.model';
import {
  type MedicalService,
  type ServiceDetail,
} from '../models/service.model';
import {
  DoctorBooking,
  ServiceBooking,
  type TimeSlot,
} from '../models/booking.model';

// ================== SERVICE DECORATOR ==================
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // =========== CONSTRUCTOR ===========

  constructor(private http: HttpClient) {}

  // =========== PRIVATE HEADER BUILDER ===========
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // =========== REGISTER USER ===========
  registerUser(userRegisterData: UserRegister) {
    const phone = userRegisterData.phone.startsWith('0')
      ? '+84' + userRegisterData.phone.slice(1)
      : userRegisterData.phone;

    const body: UserRegister = {
      phone,
      password: userRegisterData.password,
    };

    return this.http.post(`${environment.apiEndpoint}/register`, body, {
      headers: this.getHeaders(),
    });
  }

  // =========== LOGIN ===========
  loginWithPhone(phone: string, password: string) {
    const formattedPhone = phone.startsWith('0')
      ? '+84' + phone.slice(1)
      : phone;

    const body: UserLogin = {
      phone: formattedPhone,
      password,
    };

    return this.http.post(`${environment.apiEndpoint}/login`, body, {
      headers: this.getHeaders(),
    });
  }
  // ================== FORGOT PASSWORD (GỬI OTP) ==================
  forgotPassword(phone: string): Observable<any> {
    // Format lại số phone nếu bắt đầu bằng số 0
    const formattedPhone = phone.startsWith('0')
      ? '+84' + phone.slice(1)
      : phone;
    return this.http.post(
      `${environment.apiEndpoint}/forgot-password`,
      { phone: formattedPhone },
      { headers: this.getHeaders() }
    );
  }

  // ================== RESET PASSWORD (NHẬP OTP + MẬT KHẨU MỚI) ==================
  resetPassword(
    phone: string,
    otp: string,
    newPassword: string
  ): Observable<any> {
    const formattedPhone = phone.startsWith('0')
      ? '+84' + phone.slice(1)
      : phone;
    return this.http.post(
      `${environment.apiEndpoint}/reset-password`,
      {
        phone: formattedPhone,
        otp,
        password: newPassword,
      },
      { headers: this.getHeaders() }
    );
  }
  // =========== PROFILE ===========
  getUserProfile() {
    let token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${environment.apiEndpoint}/me`, { headers });
  }

  // =========== FETCH DOCTORS ===========
  /**
   * Gọi API lấy danh sách bác sĩ, có filter
   */
  getDoctors(name: string, specialty: string, gender: string) {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (specialty && specialty !== 'All')
      params = params.set('specialty', specialty);
    if (gender && gender !== 'All') params = params.set('gender', gender);

    return this.http.get<Doctor[]>(`${environment.apiEndpoint}/fetch-doctor`, {
      params,
    });
  }

  fetchDoctor(): Observable<DoctorBooking[]> {
    return this.http.get<DoctorBooking[]>(
      `${environment.apiEndpoint}/fetch-service`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getDoctorById(id: string): Observable<DoctorDetail> {
    const params = new HttpParams().set('doctor_id', id);
    return this.http.get<DoctorDetail>(
      `${environment.apiEndpoint}/fetch-doctor-id`,
      { params }
    );
  }

  // =========== FETCH BLOGS ===========
  /**
   * Gọi API lấy danh sách blog
   */
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${environment.apiEndpoint}/fetch-blog`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Gọi API lấy blog theo ID (nếu cần)
   */
  getBlogById(blogId: string): Observable<BlogDetail> {
    const params = new HttpParams().set('blog_id', blogId);
    return this.http.get<BlogDetail>(
      `${environment.apiEndpoint}/fetch-blog-id`,
      {
        params,
        headers: this.getHeaders(),
      }
    );
  }

  getServices(): Observable<MedicalService[]> {
    return this.http.get<MedicalService[]>(
      `${environment.apiEndpoint}/fetch-service`,
      {
        headers: this.getHeaders(),
      }
    );
  }
  getServiceById(serviceId: string): Observable<ServiceDetail> {
    const params = new HttpParams().set('service_id', serviceId);
    return this.http.get<ServiceDetail>(
      `${environment.apiEndpoint}/fetch-service-id`,
      {
        params,
        headers: this.getHeaders(),
      }
    );
  }
  fetchService(): Observable<ServiceBooking[]> {
    return this.http.get<ServiceBooking[]>(
      `${environment.apiEndpoint}/fetch-service`,
      {
        headers: this.getHeaders(),
      }
    );
  }
  // =========== FETCH DOCTOR BY SERVICE ===========
  /**
   * Lấy danh sách bác sĩ theo service_id
   */
  getDoctorsByService(service_id: string): Observable<DoctorBooking[]> {
    return this.http.post<DoctorBooking[]>(
      `${environment.apiEndpoint}/fetch-doctor`,
      { service_id },
      { headers: this.getHeaders() }
    );
  }

  // =========== FETCH AVAILABLE SLOTS ===========
  /**
   * Lấy danh sách slot khả dụng theo bác sĩ và ngày
   */
  getAvailableSlots(
    doctor_id: string,
    slot_date: string
  ): Observable<TimeSlot[]> {
    return this.http.post<TimeSlot[]>(
      `${environment.apiEndpoint}/get-available-slots`,
      {
        p_doctor_id: doctor_id,
        p_slot_date: slot_date,
        p_start_time: '00:00:00',
        p_end_time: '23:59:59',
        p_slot_id: null,
      },
      { headers: this.getHeaders() }
    );
  }

  // =========== BOOK APPOINTMENT ===========
  /**
   * Đặt lịch hẹn mới
   */
  bookAppointment(payload: any): Observable<any> {
    return this.http.post(
      `${environment.apiEndpoint}/book-appointment`,
      payload,
      { headers: this.getHeaders() }
    );
  }
}
