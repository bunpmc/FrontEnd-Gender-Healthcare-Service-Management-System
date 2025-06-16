import { SupabaseService } from './../../supabase.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { SearchBarComponent } from "../appointment-search-bar/appointment-search-bar.component";

interface Appointment {
  id: string;
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  visit_type: string;
  schedule_time_slot: string;
  schedule_time_range: string;
  status: string;
  created_at: string;
  message: string;
  patients?: {
    full_name: string;
    phone: string;
    email: string;
  };
}

@Component({
  selector: 'app-appointment-table',
  imports: [CommonModule],
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.css']
})
export class AppointmentTableComponent implements OnInit, OnChanges {
  @Input() appointments: Appointment[] = [];
  @Input() filters: {
    searchTerm: string;
    selectedPatient: string;
    selectedStatus: string;
    selectedDate: string;
  } = { searchTerm: '', selectedPatient: '', selectedStatus: '', selectedDate: '' };
  @Output() viewDetail = new EventEmitter<Appointment>();
  @Output() edit = new EventEmitter<Appointment>();
  @Output() confirm = new EventEmitter<Appointment>();
  @Output() complete = new EventEmitter<Appointment>();
  @Output() cancel = new EventEmitter<Appointment>();
  @Output() delete = new EventEmitter<Appointment>();
  @Output() refresh = new EventEmitter<void>();

  loading: boolean = false;
  error: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.loadAppointments();
    }
  }

  async loadAppointments(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      let query = this.supabaseService.getAllAppointments();

      // Lọc theo searchTerm (tìm kiếm theo appointment_id, phone, email, hoặc message)
      if (this.filters.searchTerm) {
        query = query.or(
          `appointment_id.ilike.%${this.filters.searchTerm}%,phone.ilike.%${this.filters.searchTerm}%,email.ilike.%${this.filters.searchTerm}%,message.ilike.%${this.filters.searchTerm}%`
        );
      }

      // Lọc theo bệnh nhân
      if (this.filters.selectedPatient) {
        query = query.eq('patient_id', this.filters.selectedPatient);
      }

      // Lọc theo trạng thái
      if (this.filters.selectedStatus) {
        query = query.eq('appointment_status', this.filters.selectedStatus);
      }

      // Lọc theo ngày (giả định schedule có định dạng "YYYY-MM-DD HH:MM-HH:MM")
      if (this.filters.selectedDate) {
        query = query.ilike('schedule', `${this.filters.selectedDate}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      this.appointments = data.map(appointment => ({
        ...appointment,
        patient_name: appointment.patients?.full_name || 'Unknown',
        patient_phone: appointment.phone || 'N/A',
        patient_email: appointment.email || 'N/A',
        schedule_time_slot: this.extractTimeSlot(appointment.schedule),
        schedule_time_range: this.extractTimeRange(appointment.schedule),
        status: appointment.appointment_status || 'pending'
      }));
    } catch (err: any) {
      this.error = 'Không thể tải danh sách cuộc hẹn. Vui lòng thử lại.';
      console.error('Lỗi khi tải appointments:', err);
    } finally {
      this.loading = false;
    }
  }

  // Các phương thức khác giữ nguyên
  formatDateTime(dateString: string): { date: string; time: string } {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  }

  formatShortId(fullId: string): string {
    return fullId ? fullId.substring(0, 12) + '...' : '';
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusTexts[status.toLowerCase()] || status;
  }

  getVisitTypeClass(visitType: string): string {
    const typeClasses: { [key: string]: string } = {
      'consultation': 'bg-blue-100 text-blue-800',
      'routine': 'bg-green-100 text-green-800',
      'follow-up': 'bg-purple-100 text-purple-800',
    };
    return typeClasses[visitType.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  getVisitTypeText(visitType: string): string {
    const typeTexts: { [key: string]: string } = {
      'consultation': 'Consultation',
      'routine': 'Routine',
      'follow-up': 'FollowUp',
    };
    return typeTexts[visitType.toLowerCase()] || visitType;
  }

  onViewDetail(appointment: Appointment): void {
    this.viewDetail.emit(appointment);
  }

  onEdit(appointment: Appointment): void {
    this.edit.emit(appointment);
  }

  onConfirm(appointment: Appointment): void {
    this.confirm.emit(appointment);
    this.updateAppointmentStatus(appointment.id, 'confirmed');
  }

  onComplete(appointment: Appointment): void {
    this.complete.emit(appointment);
    this.updateAppointmentStatus(appointment.id, 'completed');
  }

  onCancel(appointment: Appointment): void {
    this.cancel.emit(appointment);
    this.updateAppointmentStatus(appointment.id, 'cancelled');
  }

  onDelete(appointment: Appointment): void {
    if (confirm('Bạn có chắc chắn muốn xóa cuộc hẹn này?')) {
      this.delete.emit(appointment);
      this.deleteAppointment(appointment.id);
    }
  }

  private async updateAppointmentStatus(appointmentId: string, newStatus: string): Promise<void> {
    try {
      await this.supabaseService.updateAppointmentStatus(appointmentId, newStatus);
      await this.loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  }

  private async deleteAppointment(appointmentId: string): Promise<void> {
    try {
      await this.supabaseService.deleteAppointment(appointmentId);
      await this.loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Có lỗi xảy ra khi xóa cuộc hẹn');
    }
  }

  onRefresh(): void {
    this.refresh.emit();
    this.loadAppointments();
  }

  extractTimeSlot(schedule: string): string {
    try {
      const [date, time] = schedule.split(' ');
      const [startTime] = time.split('-');
      return `${date} ${startTime}`;
    } catch {
      return schedule;
    }
  }

  extractTimeRange(schedule: string): string {
    try {
      const [, time] = schedule.split(' ');
      return time;
    } catch {
      return schedule;
    }
  }
}
