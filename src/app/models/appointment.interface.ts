export interface Appointment {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id?: string; // Add if doctor_id is part of the appointments table
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
