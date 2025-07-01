export interface PhoneRegion {
  code: string;
  flag: string;
  name: string;
  dialCode: string;
  format: string;
  placeholder: string;
}

export interface BookingState {
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

export interface DoctorBooking {
  doctor_id: string;
  full_name: string;
  image_link: string;
  gender: string;
  specialization?: string;
  services?: string[]; // Array of service IDs the doctor provides
}

export interface ServiceBooking {
  service_id: string;
  name: string;
  description?: string;
}

export interface TimeSlot {
  doctor_slot_id: string;
  slot_date: string;
  slot_time: string;
  doctor_id: string;
}
// Thêm ở models/booking.model.ts hoặc file tương ứng
export interface DoctorSlotDetail {
  doctor_id: string;
  doctor_slot_id: string;
  appointments_count: number;
  max_appointments: number;
  slot_id: string;
  slot_date: string;
  slot_time: string;
  is_active: boolean;
}
