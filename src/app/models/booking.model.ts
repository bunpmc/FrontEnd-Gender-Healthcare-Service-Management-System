export interface BookingState {
  type?: 'docfirst' | 'serfirst';
  forWho?: 'me' | 'other';
  age?: number;
  city?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
}
