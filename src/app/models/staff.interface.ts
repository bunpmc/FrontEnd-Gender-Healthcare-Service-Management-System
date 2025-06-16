export interface Staff {
  staff_id: string;
  full_name: string;
  working_email: string;
  role: string; // Assuming staff_role_enum is a string-based enum
  years_experience?: number;
  hired_at: string; // Date will be handled as string from Supabase
  is_available: boolean;
  staff_status: string; // Assuming staff_status is a string-based enum
  created_at?: string;
  updated_at?: string;
  image_link?: string;
  gender?: string; // Assuming gender_enum is a string-based enum
  languages?: string[];
}

export interface Role {
  value: string;
  label: string;
}

export type StaffStatus = 'active' | 'inactive' | 'on_leave'; // Adjust based on staff_status enum values
export type Gender = 'male' | 'female' | 'other'; // Adjust based on gender_enum values
