export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // в минутах
  category: string;
  emoji: string;
}

export interface Master {
  id: string;
  name: string;
  specialization: string[];
  emoji: string;
  rating: number;
  experience: number; // лет опыта
  portfolio: string[]; // эмодзи портфолио
  bio: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
  masterId: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  masterId: string;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  reminderSent: boolean;
}

export interface LoyaltyPoints {
  userId: string;
  points: number;
  level: "bronze" | "silver" | "gold" | "platinum";
  totalSpent: number;
  cashbackPercent: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: LoyaltyPoints;
}

