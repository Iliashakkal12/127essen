export type SalonCategory =
  | "Barbershop"
  | "Salon de coiffure"
  | "Institut de beauté"
  | "Spa & bien-être";

export type Neighborhood =
  | "Maarif"
  | "Gauthier"
  | "Ain Diab"
  | "Sidi Maarouf"
  | "Oulfa"
  | "Bourgogne"
  | "Racine"
  | "CIL";

export interface Staff {
  id: string;
  name: string;
  role: string;
  initials: string;
  colorFrom: string;
  colorTo: string;
  rating: number;
  specialties: string[];
  commissionPercent: number;
  clientsServedMonth: number;
  revenueGeneratedMonth: number;
  serviceIds: string[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMin: number;
  price: number;
  staffIds: string[];
  popular?: boolean;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Salon {
  id: string;
  slug: string;
  name: string;
  category: SalonCategory;
  neighborhood: Neighborhood;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  priceTo: number;
  distanceKm: number;
  openToday: boolean;
  availableSlotsToday: number;
  openingHours: string;
  phone: string;
  description: string;
  longDescription: string;
  amenities: string[];
  gradient: string;
  featured?: boolean;
  services: Service[];
  staff: Staff[];
  reviews: Review[];
}

export type AppointmentStatus =
  | "confirmée"
  | "en attente"
  | "terminée"
  | "annulée";

export interface Appointment {
  id: string;
  clientName: string;
  clientInitials: string;
  service: string;
  staff: string;
  time: string;
  durationMin: number;
  price: number;
  status: AppointmentStatus;
  type: "réservation" | "walk-in";
}

export type QueueStatus = "en attente" | "bientôt votre tour" | "prêt" | "terminé";

export interface QueueTicket {
  id: string;
  number: string;
  clientName: string;
  service: string;
  joinedAt: string;
  estimatedWaitMin: number;
  peopleAhead: number;
  status: QueueStatus;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  rating: number;
}
