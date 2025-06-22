import { Patient } from './models/patient.interface';
import { Injectable } from '@angular/core';
import { supabase } from './supabase-client';
import { from, Observable } from 'rxjs';
import { Staff } from './models/staff.interface';
import { Role } from './models/staff.interface';
import { Service } from './models/service.interface';
import { Category } from './models/category.interface';

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


  //#region // ============= PATIENT FUNCTIONS ============= //

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

  //#endregion

  //#region // ============= APPOINTMENT FUNCTIONS ============= //
  // Lấy tất cả appointments

  getAllAppointments() {
    return supabase
      .from('appointments')
      .select(`
      *,
      patients (
        full_name,
        phone,
        email
      )
    `);
  }

  async updateAppointmentStatus(appointmentId: string, status: string) {
    const { error } = await supabase
      .from('appointments')
      .update({ appointment_status: status })
      .eq('id', appointmentId);
    if (error) throw error;
  }

  async deleteAppointment(appointmentId: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);
    if (error) throw error;
  }

  // async countAppointmentByStatus(status: string): Promise<string>  {
  //   const { data, error } = await supabase.rpc('count_appointment_by_status', { target_status: status });
  //   if (error) throw error;
  //   return String(data || 0);
  // }


  // Lấy appointment theo ID
  async getAppointmentById(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
      *,
      patients (
        id,
        full_name,
        phone,
        email,
        date_of_birth,
        gender
      )
    `)
      .eq('appointment_id', appointmentId)
      .single();

    if (error) {
      console.error("Lỗi khi load appointment: ", error.message);
      throw error;
    }

    return data;
  }

  // Lấy appointments theo patient_id
  async getAppointmentsByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi load appointments của bệnh nhân: ", error.message);
      throw error;
    }

    return data || [];
  }

  // Lấy appointments theo trạng thái
  async getAppointmentsByStatus(status: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
      *,
      patients (
        id,
        full_name,
        phone,
        email
      )
    `)
      .eq('appointment_status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi load appointments theo trạng thái: ", error.message);
      throw error;
    }

    return data || [];
  }

  // Lấy appointments theo loại visit
  async getAppointmentsByVisitType(visitType: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
      *,
      patients (
        id,
        full_name,
        phone,
        email
      )
    `)
      .eq('visit_type', visitType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi load appointments theo loại visit: ", error.message);
      throw error;
    }

    return data || [];
  }

  // Lấy appointments theo schedule
  async getAppointmentsBySchedule(schedule: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
      *,
      patients (
        id,
        full_name,
        phone,
        email
      )
    `)
      .eq('schedule', schedule)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi load appointments theo lịch: ", error.message);
      throw error;
    }

    return data || [];
  }

  // Tìm kiếm appointments theo số điện thoại hoặc email
  async searchAppointments(searchTerm: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
      *,
      patients (
        id,
        full_name,
        phone,
        email
      )
    `)
      .or(`phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi tìm kiếm appointments: ", error.message);
      throw error;
    }

    return data || [];
  }

  // Tạo appointment mới
  async createAppointment(appointmentData: {
    patient_id?: string;
    phone: string;
    email: string;
    visit_type: string;
    schedule: string;
    message?: string;
    appointment_status?: string;
  }) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Lỗi tạo appointment:', error.message);
      throw error;
    }

    return data;
  }

  // Cập nhật appointment
  async updateAppointment(appointmentId: string, updateData: {
    patient_id?: string;
    phone?: string;
    email?: string;
    visit_type?: string;
    schedule?: string;
    message?: string;
    appointment_status?: string;
  }) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('appointment_id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Lỗi cập nhật appointment:', error.message);
      throw error;
    }

    return data;
  }


  // Lấy appointments trong khoảng thời gian
  async getAppointmentsByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
      *,
      patients (
        id,
        full_name,
        phone,
        email
      )
    `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi load appointments theo ngày: ", error.message);
      throw error;
    }

    return data || [];
  }

  // Lấy appointments hôm nay
  async getTodayAppointments() {
    const today = this.getTodayDate();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = this.formatDate(tomorrow);

    return this.getAppointmentsByDateRange(today, tomorrowStr);
  }

  // Đếm số lượng appointments theo trạng thái
  async countAppointmentsByStatus(): Promise<{ [key: string]: number }> {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_status');

    if (error) {
      console.error("Lỗi khi đếm appointments: ", error.message);
      throw error;
    }

    // Đếm theo trạng thái
    const statusCount: { [key: string]: number } = {};
    data?.forEach(appointment => {
      const status = appointment.appointment_status || 'unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return statusCount;
  }

  // Lấy appointments pending (chờ xử lý)
  async getPendingAppointments() {
    return this.getAppointmentsByStatus('pending');
  }

  // Lấy appointments confirmed (đã xác nhận)
  async getConfirmedAppointments() {
    return this.getAppointmentsByStatus('confirmed');
  }

  // Lấy appointments completed (đã hoàn thành)
  async getCompletedAppointments() {
    return this.getAppointmentsByStatus('completed');
  }

  // Lấy appointments cancelled (đã hủy)
  async getCancelledAppointments() {
    return this.getAppointmentsByStatus('cancelled');
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
        description: service.description,
        overall: service.overall
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
        description: service.description,
        overall: service.overall
      })
      .eq('service_id', service.service_id);
    if (error) throw error;
  }

//#endregion
}
