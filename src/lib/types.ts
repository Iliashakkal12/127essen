/**
 * Authorization roles (conceptual — this prototype has no real auth backend,
 * see AUDIT.md). Kept here so the separation the product spec requires is
 * explicit in the type system rather than implied by which routes a
 * component happens to live under.
 *
 * - CUSTOMER: browse, book, view own appointment, join a queue.
 * - SALON_OWNER / SALON_MANAGER / STAFF: manage one or more salons they are
 *   a member of (appointments, queue, employees, services, finances).
 * - PLATFORM_OWNER: Wagti's own operator — sees every salon and
 *   platform-wide metrics. Never implied by a salon role.
 */
export type UserRole =
  | "CUSTOMER"
  | "STAFF"
  | "SALON_MANAGER"
  | "SALON_OWNER"
  | "PLATFORM_OWNER";

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

export interface WeekRevenuePoint {
  day: string;
  label: string;
  revenue: number;
}

export interface MonthRevenuePoint {
  label: string;
  revenue: number;
}

export interface RevenueByServiceEntry {
  service: string;
  revenue: number;
  count: number;
}

export interface RevenueByEmployeeEntry {
  id: string;
  name: string;
  initials: string;
  revenue: number;
  commissionPercent: number;
  commissionOwed: number;
  clients: number;
}

export interface Expense {
  id: string;
  label: string;
  category: string;
  amount: number;
  date: string;
}

export interface FinanceSummary {
  dailyRevenue: number;
  dailyRevenueChangePercent: number;
  weeklyRevenue: number;
  weeklyRevenueChangePercent: number;
  monthlyRevenue: number;
  monthlyRevenueChangePercent: number;
  totalExpensesMonth: number;
  totalCommissionsMonth: number;
  completedServicesMonth: number;
}

/** Everything the salon workspace ("Espace salon") needs for one salon, generated deterministically per salon id. See src/lib/mock/salon-operations.ts */
export interface SalonOperations {
  salonId: string;
  todayAppointments: Appointment[];
  queueTickets: QueueTicket[];
  weekRevenue: WeekRevenuePoint[];
  monthRevenue: MonthRevenuePoint[];
  revenueByService: RevenueByServiceEntry[];
  revenueByEmployee: RevenueByEmployeeEntry[];
  expenses: Expense[];
  financeSummary: FinanceSummary;
  estimatedProfit: number;
  todayAppointmentsChangePercent: number;
  walkInsChangePercent: number;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  rating: number;
}
