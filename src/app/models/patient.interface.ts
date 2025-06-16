export interface Patient {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  gender?: string;
  dob?: string;
  allergies?: object | null;
  chronic_conditions?: object | null;
  past_surgeries?: object | null;
  vaccination_status?: object | null;
  patient_status: string;
  created_at?: string;
}
