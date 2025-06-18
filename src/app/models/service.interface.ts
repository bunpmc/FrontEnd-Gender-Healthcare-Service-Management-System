export interface Service {
  service_id: string;
  category_id: string;
  service_name: string;
  service_description: string | null;
  service_cost: number | null;
  duration_minutes: number | null;
  is_active: boolean;
  image_link: string | null;
  description: any | null; // JSON type
  overall: string | null;
}
