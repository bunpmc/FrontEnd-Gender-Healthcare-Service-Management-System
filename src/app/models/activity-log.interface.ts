export interface ActivityLog {
  id: string;
  doctor_id: string;
  activity_type: ActivityType;
  title: string;
  description: string;
  patient_id?: string;
  appointment_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogCreate {
  doctor_id: string;
  activity_type: ActivityType;
  title: string;
  description: string;
  patient_id?: string;
  appointment_id?: string;
  metadata?: Record<string, any>;
}

export interface ActivityLogUpdate {
  activity_type?: ActivityType;
  title?: string;
  description?: string;
  patient_id?: string;
  appointment_id?: string;
  metadata?: Record<string, any>;
}

export type ActivityType = 
  | 'appointment_created'
  | 'appointment_updated'
  | 'appointment_cancelled'
  | 'patient_consultation'
  | 'prescription_issued'
  | 'medical_record_updated'
  | 'lab_result_reviewed'
  | 'referral_made'
  | 'follow_up_scheduled'
  | 'treatment_plan_created'
  | 'diagnosis_recorded'
  | 'surgery_performed'
  | 'medication_prescribed'
  | 'patient_discharged'
  | 'emergency_response'
  | 'consultation_notes'
  | 'other';

export interface ActivityLogFilters {
  activity_type?: ActivityType;
  date_from?: string;
  date_to?: string;
  patient_id?: string;
  search_term?: string;
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  total: number;
  page: number;
  limit: number;
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  'appointment_created': 'Appointment Created',
  'appointment_updated': 'Appointment Updated',
  'appointment_cancelled': 'Appointment Cancelled',
  'patient_consultation': 'Patient Consultation',
  'prescription_issued': 'Prescription Issued',
  'medical_record_updated': 'Medical Record Updated',
  'lab_result_reviewed': 'Lab Result Reviewed',
  'referral_made': 'Referral Made',
  'follow_up_scheduled': 'Follow-up Scheduled',
  'treatment_plan_created': 'Treatment Plan Created',
  'diagnosis_recorded': 'Diagnosis Recorded',
  'surgery_performed': 'Surgery Performed',
  'medication_prescribed': 'Medication Prescribed',
  'patient_discharged': 'Patient Discharged',
  'emergency_response': 'Emergency Response',
  'consultation_notes': 'Consultation Notes',
  'other': 'Other'
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  'appointment_created': 'bg-blue-100 text-blue-800',
  'appointment_updated': 'bg-yellow-100 text-yellow-800',
  'appointment_cancelled': 'bg-red-100 text-red-800',
  'patient_consultation': 'bg-green-100 text-green-800',
  'prescription_issued': 'bg-purple-100 text-purple-800',
  'medical_record_updated': 'bg-indigo-100 text-indigo-800',
  'lab_result_reviewed': 'bg-pink-100 text-pink-800',
  'referral_made': 'bg-orange-100 text-orange-800',
  'follow_up_scheduled': 'bg-teal-100 text-teal-800',
  'treatment_plan_created': 'bg-cyan-100 text-cyan-800',
  'diagnosis_recorded': 'bg-emerald-100 text-emerald-800',
  'surgery_performed': 'bg-rose-100 text-rose-800',
  'medication_prescribed': 'bg-violet-100 text-violet-800',
  'patient_discharged': 'bg-lime-100 text-lime-800',
  'emergency_response': 'bg-red-200 text-red-900',
  'consultation_notes': 'bg-slate-100 text-slate-800',
  'other': 'bg-gray-100 text-gray-800'
};
