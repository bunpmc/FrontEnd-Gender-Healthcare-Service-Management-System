export interface ServiceDetail {
  service_id: string;
  service_name: string;
  description: {
    what: string;
    why: string;
    who: string;
    how: string;
  };
  price: number;
  duration: number;
  image_link: string;
}
export interface Service {
  ervice_id: string;
  service_name: string;
  overall: string;
  price: number;
  image_link: string;
}
