"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Booking, Service, Master } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTelegramHaptic } from "@/lib/telegram";
import Link from "next/link";

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const haptic = useTelegramHaptic();

  useEffect(() => {
    const allBookings = storage.getBookings();
    setBookings(allBookings.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    setServices(storage.getServices());
    setMasters(storage.getMasters());
  }, []);

  const getService = (serviceId: string) => {
    return services.find((s) => s.id === serviceId);
  };

  const getMaster = (masterId: string) => {
    return masters.find((m) => m.id === masterId);
  };

  const getStatusInfo = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return { icon: CheckCircle, color: "text-green-400", label: "Подтверждена" };
      case "completed":
        return { icon: CheckCircle, color: "text-blue-400", label: "Завершена" };
      case "cancelled":
        return { icon: XCircle, color: "text-red-400", label: "Отменена" };
      default:
        return { icon: Clock, color: "text-yellow-400", label: "Ожидает" };
    }
  };

  const upcomingBookings = bookings.filter(
    (b) =>
      b.status === "confirmed" &&
      new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  const pastBookings = bookings.filter(
    (b) =>
      b.status === "completed" ||
      (b.status === "confirmed" &&
        new Date(b.date) < new Date(new Date().setHours(0, 0, 0, 0)))
  );

  return (
    <div className="pt-14 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl font-black text-white mb-1">
            История записей
          </h1>
          <p className="text-sm text-gray-400">
            Все ваши записи в одном месте
          </p>
        </motion.div>

        {/* Предстоящие записи */}
        {upcomingBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <h2 className="text-lg font-black text-white mb-3">
              Предстоящие записи
            </h2>
            <div className="space-y-2.5">
              {upcomingBookings.map((booking, index) => {
                const service = getService(booking.serviceId);
                const master = getMaster(booking.masterId);
                const statusInfo = getStatusInfo(booking.status);

                if (!service || !master) return null;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="glass rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">{service.emoji}</div>
                        <div>
                          <h3 className="text-base font-black text-white mb-0.5">
                            {service.name}
                          </h3>
                          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                            <User size={12} />
                            <span>{master.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 ${statusInfo.color}`}>
                        <statusInfo.icon size={16} />
                        <span className="text-[10px] font-bold">
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center space-x-1.5 text-xs text-gray-300">
                        <Calendar size={14} />
                        <span>
                          {format(new Date(booking.date), "d MMMM yyyy", {
                            locale: ru,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-300">
                        <Clock size={14} />
                        <span>
                          {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="text-lg font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        {service.price}₽
                      </div>
                      {!booking.reminderSent && (
                        <div className="text-[10px] text-gray-400">
                          Напоминание будет отправлено
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Прошлые записи */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-black text-white mb-3">
            Прошлые записи
          </h2>
          {pastBookings.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center border border-white/10">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-400 text-sm">
                У вас пока нет завершенных записей
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pastBookings.map((booking, index) => {
                const service = getService(booking.serviceId);
                const master = getMaster(booking.masterId);
                const statusInfo = getStatusInfo(booking.status);

                if (!service || !master) return null;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="glass rounded-xl p-4 border border-white/10 opacity-75"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">{service.emoji}</div>
                        <div>
                          <h3 className="text-base font-black text-white mb-0.5">
                            {service.name}
                          </h3>
                          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                            <User size={12} />
                            <span>{master.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 ${statusInfo.color}`}>
                        <statusInfo.icon size={16} />
                        <span className="text-[10px] font-bold">
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-1.5 text-xs text-gray-300">
                        <Calendar size={14} />
                        <span>
                          {format(new Date(booking.date), "d MMMM yyyy", {
                            locale: ru,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-300">
                        <Clock size={14} />
                        <span>
                          {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 mt-3">
                      <div className="text-lg font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        {service.price}₽
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-8 text-center border border-white/10"
          >
            <div className="text-7xl mb-4">📅</div>
            <h3 className="text-xl font-black text-white mb-3">
              У вас пока нет записей
            </h3>
            <p className="text-gray-400 mb-5 text-sm">
              Запишитесь на услугу, и она появится здесь
            </p>
            <Link href="/booking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => haptic.impact("medium")}
                className="px-5 py-2.5 glass-strong text-white rounded-lg font-black text-xs border border-white/20 shadow-[0_2px_12px_rgba(255,0,102,0.3)]"
              >
                Записаться сейчас
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
