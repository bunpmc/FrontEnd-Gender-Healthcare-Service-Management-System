import { Patient } from './models/patient.interface';
import { Injectable } from '@angular/core';
import { supabase } from './supabase-client';
import { from, Observable } from 'rxjs';
import { Staff } from './models/staff.interface';
import { Role } from './models/staff.interface';
import { Service } from './models/service.interface';
import { Category } from './models/category.interface';
import { exitCode } from 'node:process';
import { Appointment, Guest, GuestAppointment } from './models/appointment.interface';
import { ɵMetadataOverrider } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  // Đếm số bệnh nhân theo tháng
  getPatientCountByMonth(year: number, month: number): Observable<number> {
    return from(
      supabase
        .rpc('count_patients_by_month', { target_year: year, target_month: month })
        .then(({ data, error }) => {
          if (error) throw error;
          return data || 0;
        })
    );
  }

  // Tính doanh thu theo ngày
  getAppointmentCountByDay(targetDate: string): Observable<number> {
    return from(
      supabase
        .rpc('count_appointments_by_day', { target_date: targetDate })
        .then(({ data, error }) => {
          if (error) throw error;
          return data || 0;
        })
    );
  }

  // Tính doanh thu theo ngày
  getDailyRevenue(targetDate: string): Observable<number> {
    return from(
      supabase
        .rpc('calculate_daily_revenue', { target_date: targetDate })
        .then(({ data, error }) => {
          if (error) throw error;
          return data || 0;
        })
    );
  }

  // Hàm helper để format ngày tháng
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Lấy ngày hôm nay
  getTodayDate(): string {
    return this.formatDate(new Date());
  }

  // Lấy ngày hôm qua
  getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.formatDate(yesterday);
  }

  // Lấy Loại Dịch vụ
  async getServiceCatagories() {
    const { data, error } = await supabase
      .from('service_categories') // 👈 tên bảng trong Supabase
      .select('*');

    if (error) {
      console.error('Lỗi lấy dữ liệu:', error.message);
      throw error;
    }

    return data;
  }

  // Lấy tất cả bệnh nhân
  async getAllPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi load tất cả bệnh nhân: ", error.message);
      throw error;
    }

    return data || [];
  }

  async searchPatientsGeneral(query: string) {
    const { data, error } = await supabase
      .rpc('search_patients_by_fields', {
        full_name: query,
        phone: query,
        email: query
      });

    if (error) {
      console.error("Lỗi tìm kiếm bệnh nhân: ", error.message);
      throw error;
    }

    return data || [];
  }
  //#region DASHBOARD

  // Thêm method này vào SupabaseService class

  /**
   * Lấy số lượng appointments có status pending
   */
  async getPendingAppointmentsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_status', 'pending');

      if (error) {
        console.error('Error fetching pending appointments count:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getPendingAppointmentsCount:', error);
      throw error;
    }
  }

  /**
   * Lấy số lượng appointments pending cho ngày hôm nay
   */
  async getTodayPendingAppointmentsCount(): Promise<number> {
    try {
      const today = this.getTodayDate();

      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_status', 'pending')
        .eq('appointment_date', today);

      if (error) {
        console.error('Error fetching today pending appointments count:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getTodayPendingAppointmentsCount:', error);
      throw error;
    }
  }

  /**
   * Lấy số lượng appointments pending cho ngày mai (upcoming)
   */
  async getUpcomingPendingAppointmentsCount(): Promise<number> {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_status', 'pending')
        .gte('appointment_date', tomorrowStr);

      if (error) {
        console.error('Error fetching upcoming pending appointments count:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUpcomingPendingAppointmentsCount:', error);
      throw error;
    }
  }

  /*
   * Lấy notifications
  */
  async getRecentNotifications(limit: number = 5): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
      notification_id,
      notification_type,
      sent_at,
      appointment:appointments(
        appointment_id,
        created_at,
        patient:patients(full_name)
      )
    `)
      .eq('notification_type', 'new_appointment')
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return data || [];
  }

  async getTodayAppointments(today: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
      appointment_id,
      start_time,
      status,
      patient:patients(full_name)
    `)
      .gte('start_time', `${today}T00:00:00+00:00`)
      .lte('start_time', `${today}T23:59:59+00:00`)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching today\'s appointments:', error);
      throw error;
    }

    return data || [];
  }

  //#endregion

  //#region // ============= PATIENT FUNCTIONS ============= //

  async getPatients_Patient_Dashboard(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
    if (error) throw error;
    return data ?? [];
  }

  async getPatients(page: number, itemsPerPage: number): Promise<{ patients: Patient[]; total: number }> {
    const start = (page - 1) * itemsPerPage;
    const { data, count } = await supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .range(start, start + itemsPerPage - 1);
    return { patients: data ?? [], total: count ?? 0 };
  }

  async getPatientsAppointment() {
    const { data, error } = await supabase
      .from('patients')
      .select('id, full_name')
      .order('full_name', { ascending: true }); // Sắp xếp theo tên để dễ chọn
    if (error) throw error;
    return data || [];
  }

  async searchPatients(
    fullName: string,
    phone: string,
    email: string,
    page: number,
    itemsPerPage: number
  ): Promise<{ patients: Patient[]; total: number }> {
    const start = (page - 1) * itemsPerPage;
    const query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .or(`full_name.ilike.%${fullName}%,phone.ilike.%${phone}%,email.ilike.%${email}%`)
      .range(start, start + itemsPerPage - 1);
    const { data, count } = await query;
    return { patients: data ?? [], total: count ?? 0 };
  }

  async createPatient(
    id: string,
    fullName: string,
    allergies: object | null,
    chronicConditions: object | null,
    pastSurgeries: object | null,
    vaccinationStatus: object | null
  ): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          id,
          full_name: fullName,
          allergies,
          chronic_conditions: chronicConditions,
          past_surgeries: pastSurgeries,
          vaccination_status: vaccinationStatus,
          patient_status: 'Active'
        }
      ])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updatePatient(patient: Patient): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .update(patient)
      .eq('id', patient.id);
    if (error) throw error;
  }
  //#endregion

  //#region // ============= APPOINTMENT FUNCTIONS ============= //
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');
    if (error) throw error;
    return data ?? [];
  }

  async getGuestAppointments(): Promise<GuestAppointment[]> {
    const { data, error } = await supabase
      .from('guest_appointments')
      .select('*');
    if (error) throw error;
    return data ?? [];
  }

  async getPatientAppointment(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
    if (error) throw error;
    return data ?? [];
  }

  async getGuests(): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('guest_id');
    if (error) throw error;
    return data ?? [];
  }
  //#endregion

  //#region // ============= STAFF FUNCTIONS ============= //

  async getStaffMembers(): Promise<Staff[]> {
    const { data, error } = await supabase.from('staff_members').select('*');
    if (error) throw error;
    return data as Staff[];
  }

  async getStaffRoles(): Promise<Role[]> {
    // Adjust this based on how staff_role_enum is stored (e.g., a table or hardcoded enum)
    // Example: Fetch from a roles table or return static enum values
    return [
      { value: 'doctor', label: 'Doctor' },
      { value: 'receptionist', label: 'Receptionist' },
      { value: 'admin', label: 'Admin' }
      // Add other roles as per staff_role_enum
    ];
  }

  async updateStaffMember(staff: Staff): Promise<void> {
    const { error } = await supabase
      .from('staff_members')
      .update({
        full_name: staff.full_name,
        working_email: staff.working_email,
        role: staff.role,
        years_experience: staff.years_experience,
        hired_at: staff.hired_at,
        is_available: staff.is_available,
        staff_status: staff.staff_status,
        gender: staff.gender,
        languages: staff.languages,
        image_link: staff.image_link,
        updated_at: new Date().toISOString() // Update timestamp
      })
      .eq('staff_id', staff.staff_id);

    if (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  }

  async addStaffMember(staff: Staff): Promise<void> {
    const { error } = await supabase
      .from('staff_members')
      .insert({
        staff_id: staff.staff_id,
        full_name: staff.full_name,
        working_email: staff.working_email,
        role: staff.role,
        years_experience: staff.years_experience,
        hired_at: staff.hired_at,
        is_available: staff.is_available,
        staff_status: staff.staff_status,
        gender: staff.gender,
        languages: staff.languages,
        image_link: staff.image_link,
        created_at: staff.created_at,
        updated_at: staff.updated_at
      });
    if (error) {
      console.error('Error adding staff member:', error);
      throw error;
    }
  }
  //#endregion

  //#region //#region // ============= SERVICE FUNCTIONS ============= //

  async getMedicalService(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('medical_services')
      .select('*');
    if (error) throw error;
    return data as Service[];
  }

  async getServiceCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*');
    if (error) throw error;
    return data as Category[];
  }

  async addMedicalService(service: Service): Promise<void> {
    const { error } = await supabase
      .from('medical_services')
      .insert([{
        category_id: service.category_id,
        service_name: service.service_name,
        service_description: service.service_description,
        service_cost: service.service_cost,
        duration_minutes: service.duration_minutes,
        is_active: service.is_active,
        image_link: service.image_link,
        excerpt: service.excerpt
      }]);
    if (error) throw error;
  }

  async updateMedicalService(service: Service): Promise<void> {
    const { error } = await supabase
      .from('medical_services')
      .update({
        category_id: service.category_id,
        service_name: service.service_name,
        service_description: service.service_description,
        service_cost: service.service_cost,
        duration_minutes: service.duration_minutes,
        is_active: service.is_active,
        image_link: service.image_link,
        excerpt: service.excerpt
      })
      .eq('service_id', service.service_id);
    if (error) throw error;
  }

  //#endregion
}
