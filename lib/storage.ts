import { Service, Master, Booking, User, TimeSlot } from "./types";

const STORAGE_KEYS = {
  SERVICES: "beauty_salon_services",
  MASTERS: "beauty_salon_masters",
  BOOKINGS: "beauty_salon_bookings",
  USER: "beauty_salon_user",
  TIME_SLOTS: "beauty_salon_time_slots",
} as const;

// Инициализация данных по умолчанию
const defaultServices: Service[] = [
  {
    id: "1",
    name: "Стрижка мужская",
    description: "Профессиональная стрижка с укладкой",
    price: 1500,
    duration: 60,
    category: "haircut",
    emoji: "✂️",
  },
  {
    id: "2",
    name: "Борода и усы",
    description: "Стрижка и оформление бороды",
    price: 800,
    duration: 30,
    category: "beard",
    emoji: "🧔",
  },
  {
    id: "3",
    name: "Бритье опасной бритвой",
    description: "Классическое бритье с горячим полотенцем",
    price: 1200,
    duration: 45,
    category: "shave",
    emoji: "🪒",
  },
  {
    id: "4",
    name: "Комплекс 'Все включено'",
    description: "Стрижка + борода + укладка + маска",
    price: 2800,
    duration: 90,
    category: "complex",
    emoji: "✨",
  },
  {
    id: "5",
    name: "Укладка волос",
    description: "Стильная укладка с использованием профессиональных средств",
    price: 600,
    duration: 30,
    category: "styling",
    emoji: "💇",
  },
  {
    id: "6",
    name: "Окрашивание",
    description: "Окрашивание волос любой сложности",
    price: 3500,
    duration: 120,
    category: "coloring",
    emoji: "🎨",
  },
];

const defaultMasters: Master[] = [
  {
    id: "1",
    name: "Алексей",
    specialization: ["haircut", "beard", "styling"],
    emoji: "👨‍🦱",
    rating: 4.9,
    experience: 8,
    portfolio: ["💇", "✂️", "🧔", "✨"],
    bio: "Мастер с 8-летним опытом, специализируюсь на классических и современных стрижках",
  },
  {
    id: "2",
    name: "Дмитрий",
    specialization: ["shave", "beard", "complex"],
    emoji: "👨",
    rating: 5.0,
    experience: 12,
    portfolio: ["🪒", "🧔", "✨", "💎"],
    bio: "Эксперт по бритью опасной бритвой и оформлению бороды. Работаю в премиум сегменте",
  },
  {
    id: "3",
    name: "Максим",
    specialization: ["coloring", "styling", "complex"],
    emoji: "👨‍🎨",
    rating: 4.8,
    experience: 6,
    portfolio: ["🎨", "💇", "✨", "🌟"],
    bio: "Колорист и стилист. Создаю уникальные образы и трендовые окрашивания",
  },
  {
    id: "4",
    name: "Иван",
    specialization: ["haircut", "beard", "shave"],
    emoji: "👨‍💼",
    rating: 4.7,
    experience: 5,
    portfolio: ["✂️", "🧔", "🪒", "💼"],
    bio: "Молодой, но амбициозный мастер. Специализируюсь на мужских стрижках",
  },
];

const defaultUser: User = {
  id: "user_1",
  name: "Гость",
  phone: "+7 (999) 123-45-67",
  email: "guest@example.com",
  loyaltyPoints: {
    userId: "user_1",
    points: 150,
    level: "silver",
    totalSpent: 5000,
    cashbackPercent: 5,
  },
};

// Утилиты для работы с localStorage
export const storage = {
  // Services
  getServices: (): Service[] => {
    if (typeof window === "undefined") return defaultServices;
    const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
      return defaultServices;
    }
    return JSON.parse(stored);
  },

  saveServices: (services: Service[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  },

  // Masters
  getMasters: (): Master[] => {
    if (typeof window === "undefined") return defaultMasters;
    const stored = localStorage.getItem(STORAGE_KEYS.MASTERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.MASTERS, JSON.stringify(defaultMasters));
      return defaultMasters;
    }
    return JSON.parse(stored);
  },

  saveMasters: (masters: Master[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.MASTERS, JSON.stringify(masters));
  },

  // Bookings
  getBookings: (): Booking[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return stored ? JSON.parse(stored) : [];
  },

  saveBookings: (bookings: Booking[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  addBooking: (booking: Booking) => {
    const bookings = storage.getBookings();
    bookings.push(booking);
    storage.saveBookings(bookings);
  },

  // User
  getUser: (): User => {
    if (typeof window === "undefined") return defaultUser;
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(stored);
  },

  saveUser: (user: User) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Time Slots (генерируются динамически)
  generateTimeSlots: (date: string, masterId: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 21;
    const slotDuration = 30; // минут

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const endMinute = minute + slotDuration;
        const endHourCalc = endMinute >= 60 ? hour + 1 : hour;
        const endMinuteCalc = endMinute >= 60 ? endMinute - 60 : endMinute;
        const endTime = `${endHourCalc.toString().padStart(2, "0")}:${endMinuteCalc.toString().padStart(2, "0")}`;

        // Проверяем существующие бронирования
        const bookings = storage.getBookings();
        const isBooked = bookings.some(
          (b) =>
            b.date === date &&
            b.masterId === masterId &&
            b.timeSlot.startTime === startTime &&
            b.status !== "cancelled"
        );

        slots.push({
          id: `${masterId}_${date}_${startTime}`,
          startTime,
          endTime,
          available: !isBooked,
          masterId,
        });
      }
    }

    return slots;
  },
};

