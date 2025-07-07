// ================== IMPORTS ==================
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { type UserLogin, type UserRegister } from '../models/user.model';
import { Observable } from 'rxjs';

// ================== SERVICE DECORATOR ==================
@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
  getUserProfile(): Observable<any> {
    let token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');

    if (!token) {
      throw new Error('No access token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Call REST API endpoint cho user profile
    return this.http.get(`${environment.apiEndpoint}/user-profile`, {
      headers,
    });
  }
}
