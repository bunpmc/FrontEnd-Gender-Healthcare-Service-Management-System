-- SQL script to create the doctor_activity_logs table in Supabase
-- Run this in your Supabase SQL editor

-- Create the activity type enum
CREATE TYPE activity_type_enum AS ENUM (
  'appointment_created',
  'appointment_updated', 
  'appointment_cancelled',
  'patient_consultation',
  'prescription_issued',
  'medical_record_updated',
  'lab_result_reviewed',
  'referral_made',
  'follow_up_scheduled',
  'treatment_plan_created',
  'diagnosis_recorded',
  'surgery_performed',
  'medication_prescribed',
  'patient_discharged',
  'emergency_response',
  'consultation_notes',
  'other'
);

-- Create the doctor_activity_logs table
CREATE TABLE doctor_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id VARCHAR(255) NOT NULL,
  activity_type activity_type_enum NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  patient_id VARCHAR(255),
  appointment_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_doctor_activity_logs_doctor_id ON doctor_activity_logs(doctor_id);
CREATE INDEX idx_doctor_activity_logs_activity_type ON doctor_activity_logs(activity_type);
CREATE INDEX idx_doctor_activity_logs_created_at ON doctor_activity_logs(created_at);
CREATE INDEX idx_doctor_activity_logs_patient_id ON doctor_activity_logs(patient_id);
CREATE INDEX idx_doctor_activity_logs_appointment_id ON doctor_activity_logs(appointment_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_doctor_activity_logs_updated_at 
    BEFORE UPDATE ON doctor_activity_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE doctor_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication setup)
-- Policy for doctors to see only their own activity logs
CREATE POLICY "Doctors can view their own activity logs" ON doctor_activity_logs
    FOR SELECT USING (doctor_id = auth.uid()::text);

-- Policy for doctors to insert their own activity logs
CREATE POLICY "Doctors can insert their own activity logs" ON doctor_activity_logs
    FOR INSERT WITH CHECK (doctor_id = auth.uid()::text);

-- Policy for doctors to update their own activity logs
CREATE POLICY "Doctors can update their own activity logs" ON doctor_activity_logs
    FOR UPDATE USING (doctor_id = auth.uid()::text);

-- Policy for doctors to delete their own activity logs
CREATE POLICY "Doctors can delete their own activity logs" ON doctor_activity_logs
    FOR DELETE USING (doctor_id = auth.uid()::text);

-- Insert some sample data for testing (optional)
INSERT INTO doctor_activity_logs (doctor_id, activity_type, title, description, patient_id, metadata) VALUES
('doctor-123', 'patient_consultation', 'Initial consultation with new patient', 'Conducted comprehensive health assessment for new patient. Discussed medical history and current symptoms.', 'patient-456', '{"duration_minutes": 45, "consultation_type": "initial"}'),
('doctor-123', 'prescription_issued', 'Prescribed medication for hypertension', 'Issued prescription for Lisinopril 10mg daily for blood pressure management.', 'patient-789', '{"medication": "Lisinopril", "dosage": "10mg", "frequency": "daily"}'),
('doctor-123', 'follow_up_scheduled', 'Scheduled follow-up appointment', 'Scheduled 2-week follow-up to monitor blood pressure medication effectiveness.', 'patient-789', '{"follow_up_date": "2024-01-15", "reason": "medication_monitoring"}'),
('doctor-123', 'lab_result_reviewed', 'Reviewed blood work results', 'Analyzed complete blood count and metabolic panel. All values within normal range.', 'patient-456', '{"test_types": ["CBC", "CMP"], "status": "normal"}'),
('doctor-123', 'medical_record_updated', 'Updated patient medical history', 'Added new allergy information and updated current medications list.', 'patient-456', '{"changes": ["allergies", "medications"], "updated_by": "doctor-123"}')
