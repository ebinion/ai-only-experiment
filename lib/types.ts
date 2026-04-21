export type ShelterType = "shelter" | "rescue";

export interface Shelter {
  id: string;
  name: string;
  type: ShelterType;
  city: string;
  state: string;
  lat: number;
  lng: number;
  email: string;
  phone: string;
}
