export interface Service {
  service_id: string;
  category_id: string;
  service_name: string;
  service_description?: string;
  service_cost: number;
  duration_minutes?: number;
  is_active: boolean;
}
