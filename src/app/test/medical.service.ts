// ================== IMPORTS ==================
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {
  type MedicalService as MedicalServiceModel,
  type ServiceDetail,
} from '../models/service.model';
import { ServiceBooking } from '../models/booking.model';
import { Observable } from 'rxjs';

// ================== SERVICE DECORATOR ==================
@Injectable({
  providedIn: 'root',
})
export class MedicalService {
  // =========== CONSTRUCTOR ===========
  constructor(private http: HttpClient) {}

  // =========== PRIVATE HEADER BUILDER ===========
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // =========== FETCH SERVICES ===========
  /**
   * Gọi API lấy danh sách dịch vụ y tế
   */
  getServices(): Observable<MedicalServiceModel[]> {
    return this.http.get<MedicalServiceModel[]>(
      `${environment.apiEndpoint}/fetch-service`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // =========== FETCH SERVICE BY ID ===========
  /**
   * Gọi API lấy dịch vụ theo ID
   */
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

  // =========== FETCH SERVICES FOR BOOKING ===========
  /**
   * Lấy danh sách dịch vụ cho booking (old endpoint)
   */
  fetchService(): Observable<ServiceBooking[]> {
    return this.http.get<ServiceBooking[]>(
      `${environment.apiEndpoint}/fetch-service`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // =========== FETCH SERVICES FOR BOOKING (NEW ENDPOINT) ===========
  /**
   * Lấy danh sách dịch vụ cho booking từ endpoint mới
   */
  fetchServiceBooking(): Observable<ServiceBooking[]> {
    return this.http.get<ServiceBooking[]>(
      `${environment.apiEndpoint}/fetch-serviceBooking`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
