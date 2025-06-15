import { Injectable } from '@angular/core';
import { supabase } from './supabase-client';
import { from, Observable } from 'rxjs';

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

  // Lấy Dịch vụ
  async getMedicalService() {
    const { data, error } = await supabase
      .from('medical_services') // 👈 tên bảng trong Supabase
      .select('*');

    if (error) {
      console.error('Lỗi lấy dữ liệu:', error.message);
      throw error;
    }

    return data;
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

  // Tìm kiếm bệnh nhân theo tên, điện thoại, hoặc email
  async searchPatients(fullName: string, phone: string, email: string) {
    const { data, error } = await supabase
      .rpc('search_patients_by_fields', {
        full_name: fullName,
        phone: phone,
        email: email
      });

    if (error) {
      console.error("Lỗi tìm kiếm bệnh nhân: ", error.message);
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


  // Tạo bệnh nhân mới
  async createPatient(
    id: string,
    name: string,
    allergies?: object,
    chronic_conditions?: object,
    past_surgeries?: object,
    vaccination_status?: object,
    patient_status: string = 'in_treatment'
  ) {
    const { data, error } = await supabase
      .rpc('create_patient', {
        id,
        name,
        allergies,
        chronic_conditions,
        past_surgeries,
        vaccination_status,
        patient_status
      });

    if (error) {
      console.error('Lỗi tạo bệnh nhân:', error.message);
      throw error;
    }

    return data;
  }


  // ============= APPOINTMENT FUNCTIONS =============

  // Lấy tất cả appointments
  async getAllAppointments() {
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi khi load tất cả appointments: ", error.message);
      throw error;
    }

    return data || [];
  }

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

  // Cập nhật trạng thái appointment
  async updateAppointmentStatus(appointmentId: string, status: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        appointment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('appointment_id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Lỗi cập nhật trạng thái appointment:', error.message);
      throw error;
    }

    return data;
  }

  // Xóa appointment
  async deleteAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .delete()
      .eq('appointment_id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Lỗi xóa appointment:', error.message);
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

}
