// ================== IMPORTS ==================
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { type TimeSlot, type DoctorSlotDetail } from '../models/booking.model';
import { Observable } from 'rxjs';

// ================== SERVICE DECORATOR ==================
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  // =========== CONSTRUCTOR ===========
  constructor(private http: HttpClient) {}

  // =========== PRIVATE HEADER BUILDER ===========
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
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

  // =========== FETCH SLOTS BY DOCTOR ID ===========
  /**
   * Lấy danh sách slot theo doctor_id từ API mới
   */
  fetchSlotsByDoctorId(doctor_id: string): Observable<any> {
    const params = new HttpParams().set('doctor_id', doctor_id);
    return this.http.get(`${environment.apiEndpoint}/fetch-slot-by-doctor-id`, {
      params,
      headers: this.getHeaders(),
    });
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
