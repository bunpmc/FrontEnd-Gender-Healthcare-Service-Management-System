export interface Appointment {
  appointment_id: string;
  patient_id: string | null;
  doctor_id: string | null;
  slot_id: string | null;
  phone: string;
  email: string;
  visit_type: string;
  appointment_status: string | null;
  created_at: string | null;
  updated_at: string | null;
  schedule: string;
}

export interface GuestAppointment {
  guest_appointment_id: string;
  guest_id: string | null;
  slot_id: string | null;
  phone: string;
  email: string;
  visit_type: string;
  appointment_status: string | null;
  created_at: string | null;
  updated_at: string | null;
  schedule: string;
}

export interface Guest {
  guest_id: string;
}

export interface DisplayAppointment {
  id: string;
  type: 'patient' | 'guest';
  name: string;
  phone: string;
  email: string;
  visit_type: string;
  appointment_status: string | null;
  created_at: string | null;
  updated_at: string | null;
  schedule: string;
}
