import type { Appointment, QueueTicket } from "@/lib/types";

export const todayAppointments: Appointment[] = [
  { id: "a1", clientName: "Adil Mansouri", clientInitials: "AM", service: "Dégradé + barbe", staff: "Yassine El Amrani", time: "09:00", durationMin: 45, price: 130, status: "terminée", type: "réservation" },
  { id: "a2", clientName: "Hamza Tazi", clientInitials: "HT", service: "Coupe homme classique", staff: "Karim Bensaid", time: "09:30", durationMin: 30, price: 80, status: "terminée", type: "réservation" },
  { id: "a3", clientName: "Younes Kadiri", clientInitials: "YK", service: "Taille de barbe", staff: "Othmane Raji", time: "10:00", durationMin: 20, price: 60, status: "terminée", type: "walk-in" },
  { id: "a4", clientName: "Ilyas Berrada", clientInitials: "IB", service: "Coupe + barbe + soin", staff: "Yassine El Amrani", time: "10:30", durationMin: 60, price: 220, status: "confirmée", type: "réservation" },
  { id: "a5", clientName: "Nabil Ouazzani", clientInitials: "NO", service: "Rasage traditionnel", staff: "Yassine El Amrani", time: "11:30", durationMin: 25, price: 90, status: "confirmée", type: "réservation" },
  { id: "a6", clientName: "Tarik Haddad", clientInitials: "TH", service: "Coupe homme classique", staff: "Karim Bensaid", time: "12:00", durationMin: 30, price: 80, status: "en attente", type: "réservation" },
  { id: "a7", clientName: "Walk-in", clientInitials: "WI", service: "Taille de barbe", staff: "Othmane Raji", time: "12:15", durationMin: 20, price: 60, status: "en attente", type: "walk-in" },
  { id: "a8", clientName: "Karim Doukkali", clientInitials: "KD", service: "Dégradé + barbe", staff: "Othmane Raji", time: "14:00", durationMin: 45, price: 130, status: "confirmée", type: "réservation" },
  { id: "a9", clientName: "Anas Benjelloun", clientInitials: "AB", service: "Soin visage homme", staff: "Othmane Raji", time: "15:00", durationMin: 30, price: 150, status: "confirmée", type: "réservation" },
  { id: "a10", clientName: "Sami Regragui", clientInitials: "SR", service: "Coupe homme classique", staff: "Karim Bensaid", time: "16:00", durationMin: 30, price: 80, status: "annulée", type: "réservation" },
  { id: "a11", clientName: "Reda Chraibi", clientInitials: "RC", service: "Coupe + barbe + soin", staff: "Yassine El Amrani", time: "17:00", durationMin: 60, price: 220, status: "confirmée", type: "réservation" },
  { id: "a12", clientName: "Bilal Moussaoui", clientInitials: "BM", service: "Dégradé + barbe", staff: "Karim Bensaid", time: "18:00", durationMin: 45, price: 130, status: "confirmée", type: "réservation" },
];

export const queueTickets: QueueTicket[] = [
  { id: "q1", number: "A-014", clientName: "Mehdi Alaoui", service: "Coupe homme classique", joinedAt: "12:02", estimatedWaitMin: 5, peopleAhead: 0, status: "prêt" },
  { id: "q2", number: "A-015", clientName: "Anas Idrissi", service: "Dégradé + barbe", joinedAt: "12:08", estimatedWaitMin: 15, peopleAhead: 1, status: "bientôt votre tour" },
  { id: "q3", number: "A-016", clientName: "Zakaria Ammor", service: "Taille de barbe", joinedAt: "12:14", estimatedWaitMin: 25, peopleAhead: 2, status: "en attente" },
  { id: "q4", number: "A-017", clientName: "Yassine Bakkali", service: "Coupe homme classique", joinedAt: "12:20", estimatedWaitMin: 35, peopleAhead: 3, status: "en attente" },
];
