"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Service, Master, Booking, TimeSlot } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Calendar, Clock, User, Scissors, CheckCircle, Star, ArrowLeft, CreditCard, User as UserIcon, Phone } from "lucide-react";
import { format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { useTelegramHaptic, useTelegramBackButton, useTelegramMainButton } from "@/lib/telegram";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const haptic = useTelegramHaptic();

  // Форматирование номера телефона
  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, "");
    
    // Ограничиваем до 11 цифр
    const limitedNumbers = numbers.slice(0, 11);
    
    // Форматируем как +7 (999) 123-45-67
    if (limitedNumbers.length === 0) return "";
    if (limitedNumbers.length <= 1) return `+${limitedNumbers}`;
    if (limitedNumbers.length <= 4) return `+${limitedNumbers[0]} (${limitedNumbers.slice(1)}`;
    if (limitedNumbers.length <= 7) return `+${limitedNumbers[0]} (${limitedNumbers.slice(1, 4)}) ${limitedNumbers.slice(4)}`;
    if (limitedNumbers.length <= 9) return `+${limitedNumbers[0]} (${limitedNumbers.slice(1, 4)}) ${limitedNumbers.slice(4, 7)}-${limitedNumbers.slice(7)}`;
    return `+${limitedNumbers[0]} (${limitedNumbers.slice(1, 4)}) ${limitedNumbers.slice(4, 7)}-${limitedNumbers.slice(7, 9)}-${limitedNumbers.slice(9)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setClientPhone(formatted);
  };

  useEffect(() => {
    setServices(storage.getServices());
    setMasters(storage.getMasters());

    const serviceId = searchParams.get("service");
    const masterId = searchParams.get("master");

    if (serviceId) {
      const service = storage.getServices().find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        // Если есть и мастер, переходим к выбору даты
        if (masterId) {
          const master = storage.getMasters().find((m) => m.id === masterId);
          if (master) {
            setSelectedMaster(master);
            setStep(3);
          } else {
            setStep(2);
          }
        } else {
          setStep(2);
        }
      }
    } else if (masterId) {
      // Если переходим только с мастера, показываем выбор услуги (шаг 1)
      const master = storage.getMasters().find((m) => m.id === masterId);
      if (master) {
        setSelectedMaster(master);
        setStep(1); // Показываем выбор услуги, но мастер уже выбран
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedDate && selectedMaster) {
      setTimeSlots(storage.generateTimeSlots(selectedDate, selectedMaster.id));
    }
  }, [selectedDate, selectedMaster]);

  // Telegram back button
  useTelegramBackButton(() => {
    if (step > 1) {
      setStep(step - 1);
      haptic.impact("light");
    } else {
      router.push("/");
    }
  });

  // Telegram main button для финального шага
  useTelegramMainButton(
    "Подтвердить запись",
    handleBooking,
    step === 5 && selectedTimeSlot
      ? {
          color: "#ff0066",
          textColor: "#ffffff",
          isVisible: true,
        }
      : { isVisible: false }
  );

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Если мастер уже выбран, пропускаем шаг выбора мастера
    if (selectedMaster) {
      setStep(3);
    } else {
      setStep(2);
    }
    haptic.impact("medium");
  };

  const handleMasterSelect = (master: Master) => {
    setSelectedMaster(master);
    setStep(3);
    haptic.impact("medium");
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setStep(4);
    haptic.selection();
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
      setStep(5);
      haptic.impact("light");
    }
  };

  function handlePayment() {
    // Проверяем что номер содержит минимум 11 цифр
    const phoneNumbers = clientPhone.replace(/\D/g, "");
    
    if (!clientName.trim() || phoneNumbers.length < 11) {
      haptic.notification("error");
      alert("Пожалуйста, заполните все поля корректно. Номер телефона должен содержать 11 цифр.");
      return;
    }

    if (!selectedService || !selectedMaster || !selectedDate || !selectedTimeSlot) {
      return;
    }

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      serviceId: selectedService.id,
      masterId: selectedMaster.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      reminderSent: false,
    };

    storage.addBooking(booking);

    // Обновляем пользователя
    const user = storage.getUser();
    user.name = clientName;
    // Сохраняем номер без форматирования (только цифры)
    user.phone = phoneNumbers;
    
    // Обновляем бонусы
    const pointsToAdd = Math.floor(selectedService.price / 100);
    user.loyaltyPoints.points += pointsToAdd;
    user.loyaltyPoints.totalSpent += selectedService.price;

    // Обновляем уровень
    if (user.loyaltyPoints.totalSpent >= 20000) {
      user.loyaltyPoints.level = "platinum";
      user.loyaltyPoints.cashbackPercent = 15;
    } else if (user.loyaltyPoints.totalSpent >= 10000) {
      user.loyaltyPoints.level = "gold";
      user.loyaltyPoints.cashbackPercent = 10;
    } else if (user.loyaltyPoints.totalSpent >= 5000) {
      user.loyaltyPoints.level = "silver";
      user.loyaltyPoints.cashbackPercent = 5;
    }

    storage.saveUser(user);
    haptic.notification("success");
    setShowPaymentForm(false);
    setBookingComplete(true);
  }

  function handleBooking() {
    setShowPaymentForm(true);
    haptic.impact("medium");
  }

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, "yyyy-MM-dd");
  });

  const filteredMasters = selectedService
    ? masters.filter((m) => m.specialization.includes(selectedService.category))
    : masters;

  if (bookingComplete) {
    return (
      <div className="pt-14 px-4 pb-24 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-strong rounded-2xl p-6 max-w-sm w-full border border-white/20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-7xl mb-6"
          >
            ✅
          </motion.div>
          <h2 className="text-2xl font-black text-white mb-4">
            Заявка отправлена!
          </h2>
          <p className="text-sm text-gray-400 mb-2">
            Ваша запись успешно создана
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Мы отправим вам напоминание за день до визита. Запись сохранена в вашем профиле.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setBookingComplete(false);
              setStep(1);
              setSelectedService(null);
              setSelectedMaster(null);
              setSelectedDate("");
              setSelectedTimeSlot(null);
              haptic.impact("medium");
            }}
            className="w-full px-6 py-4 glass-strong text-white rounded-2xl font-black text-base border border-white/20 shadow-[0_8px_32px_rgba(255,0,102,0.4)]"
          >
            Новая запись
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-14 px-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl font-black text-white mb-1">
            Онлайн запись
          </h1>
          <p className="text-sm text-gray-400">Выберите услугу, мастера и время</p>
        </motion.div>

        {/* Прогресс */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full mx-0.5 ${
                  s <= step ? "bg-gradient-to-r from-primary-600 to-accent-600" : "bg-black/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Шаг 1: Выбор услуги */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <h2 className="text-lg font-black text-white mb-4 flex items-center">
              <Scissors className="mr-2" size={18} />
              Выберите услугу
            </h2>
            {selectedMaster && (
              <div className="mb-4 p-3 glass-light rounded-lg border border-primary-500/30">
                <div className="text-[10px] text-gray-400 mb-1">Выбранный мастер:</div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedMaster.emoji}</span>
                  <div>
                    <div className="text-sm font-black text-white">{selectedMaster.name}</div>
                    <div className="text-[10px] text-gray-400">Рейтинг: {selectedMaster.rating} ⭐</div>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2.5">
              {services.map((service) => (
                <motion.button
                  key={service.id}
                  whileHover={{ scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleServiceSelect(service)}
                  className="w-full text-left p-3 glass-light rounded-lg border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-3xl">{service.emoji}</span>
                    <span className="text-base font-black text-primary-500">
                      {service.price}₽
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mb-0.5">
                    {service.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 mb-1">{service.description}</p>
                  <div className="text-[10px] text-gray-500">
                    {service.duration} минут
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Шаг 2: Выбор мастера */}
        {step === 2 && selectedService && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="mb-4">
              <button
                onClick={() => {
                  setStep(1);
                  haptic.selection();
                }}
                className="text-primary-400 hover:text-primary-300 mb-3 flex items-center text-xs"
              >
                <ArrowLeft size={14} className="mr-1" />
                Назад
              </button>
              <h2 className="text-lg font-black text-white mb-1.5 flex items-center">
                <User className="mr-2" size={18} />
                Выберите мастера
              </h2>
              <div className="text-[10px] text-gray-400">
                Выбрано: {selectedService.name}
              </div>
            </div>
            <div className="space-y-2.5">
              {filteredMasters.map((master) => (
                <motion.button
                  key={master.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleMasterSelect(master)}
                  className="w-full text-left p-3 glass-light rounded-lg border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-1.5">
                    <span className="text-4xl">{master.emoji}</span>
                    <div>
                      <h3 className="text-sm font-black text-white">
                        {master.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star size={12} className="fill-yellow-400" />
                        <span className="text-xs">{master.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">{master.bio}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Шаг 3: Выбор даты */}
        {step === 3 && selectedService && selectedMaster && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="mb-4">
              <button
                onClick={() => {
                  setStep(2);
                  haptic.selection();
                }}
                className="text-primary-400 hover:text-primary-300 mb-3 flex items-center text-xs"
              >
                <ArrowLeft size={14} className="mr-1" />
                Назад
              </button>
              <h2 className="text-lg font-black text-white mb-1.5 flex items-center">
                <Calendar className="mr-2" size={18} />
                Выберите дату
              </h2>
              <div className="text-[10px] text-gray-400">
                Мастер: {selectedMaster.name} | Услуга: {selectedService.name}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {availableDates.map((date) => (
                <motion.button
                  key={date}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateSelect(date)}
                  className={`p-2 rounded-lg border transition-all text-xs ${
                    selectedDate === date
                      ? "glass-strong border-white/30 text-white shadow-[0_2px_12px_rgba(255,0,102,0.4)]"
                      : "glass-light border-white/10 text-gray-300 hover:border-white/20"
                  }`}
                >
                  <div className="font-black text-xs">
                    {format(new Date(date), "d")}
                  </div>
                  <div className="text-[9px] opacity-70">
                    {format(new Date(date), "EEE", { locale: ru }).slice(0, 2)}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Шаг 4: Выбор времени */}
        {step === 4 && selectedService && selectedMaster && selectedDate && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="mb-4">
              <button
                onClick={() => {
                  setStep(3);
                  haptic.selection();
                }}
                className="text-primary-400 hover:text-primary-300 mb-3 flex items-center text-xs"
              >
                <ArrowLeft size={14} className="mr-1" />
                Назад
              </button>
              <h2 className="text-lg font-black text-white mb-1.5 flex items-center">
                <Clock className="mr-2" size={18} />
                Выберите время
              </h2>
              <div className="text-[10px] text-gray-400">
                {format(new Date(selectedDate), "d MMMM yyyy", { locale: ru})} |{" "}
                {selectedMaster.name}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {timeSlots.map((slot) => (
                <motion.button
                  key={slot.id}
                  whileHover={{ scale: slot.available ? 1.05 : 1 }}
                  whileTap={{ scale: slot.available ? 0.95 : 1 }}
                  onClick={() => handleTimeSlotSelect(slot)}
                  disabled={!slot.available}
                  className={`p-2 rounded-lg border transition-all text-xs font-black ${
                    selectedTimeSlot?.id === slot.id
                      ? "glass-strong border-white/30 text-white shadow-[0_2px_10px_rgba(255,0,102,0.4)]"
                      : slot.available
                      ? "glass-light border-white/10 text-gray-300 hover:border-white/20"
                      : "glass border-black/20 text-gray-600 cursor-not-allowed opacity-40"
                  }`}
                >
                  {slot.startTime}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Шаг 5: Подтверждение */}
        {step === 5 &&
          selectedService &&
          selectedMaster &&
          selectedDate &&
          selectedTimeSlot && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="mb-4">
              <button
                onClick={() => {
                  setStep(4);
                  haptic.selection();
                }}
                className="text-primary-400 hover:text-primary-300 mb-3 flex items-center text-xs"
              >
                <ArrowLeft size={14} className="mr-1" />
                Назад
              </button>
              <h2 className="text-lg font-black text-white mb-4 flex items-center">
                <CheckCircle className="mr-2" size={18} />
                Подтверждение записи
              </h2>
            </div>

            <div className="space-y-2.5 mb-5">
              <div className="p-3 glass-light rounded-lg border border-white/10">
                <div className="text-[10px] text-gray-400 mb-0.5">Услуга</div>
                <div className="text-sm font-black text-white">
                  {selectedService.emoji} {selectedService.name}
                </div>
                <div className="text-[10px] text-gray-400">
                  {selectedService.duration} минут
                </div>
              </div>

              <div className="p-3 glass-light rounded-lg border border-white/10">
                <div className="text-[10px] text-gray-400 mb-0.5">Мастер</div>
                <div className="text-sm font-black text-white">
                  {selectedMaster.emoji} {selectedMaster.name}
                </div>
                <div className="text-[10px] text-gray-400">
                  Рейтинг: {selectedMaster.rating} ⭐
                </div>
              </div>

              <div className="p-3 glass-light rounded-lg border border-white/10">
                <div className="text-[10px] text-gray-400 mb-0.5">Дата и время</div>
                <div className="text-sm font-black text-white">
                  {format(new Date(selectedDate), "d MMMM yyyy", {
                    locale: ru,
                  })}
                </div>
                <div className="text-[10px] text-gray-400">
                  {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                </div>
              </div>

              <div className="p-3 glass-strong rounded-lg border border-white/20">
                <div className="text-[10px] text-gray-400 mb-0.5">Стоимость</div>
                <div className="text-xl font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {selectedService.price}₽
                </div>
              </div>
            </div>

            {!showPaymentForm ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="w-full px-5 py-3.5 glass-strong rounded-xl font-black text-sm text-white border border-white/20 shadow-[0_4px_20px_rgba(255,0,102,0.3)] flex items-center justify-center space-x-2"
              >
                <CreditCard size={18} />
                <span>Оплатить и подтвердить</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-3 glass-light rounded-lg border border-white/10">
                  <div className="text-xs font-black text-white mb-3 flex items-center">
                    <UserIcon size={16} className="mr-2" />
                    Ваши данные
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        placeholder="Ваше имя"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2.5 glass rounded-lg border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500/50 bg-black/20"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="+7 (999) 123-45-67"
                        value={clientPhone}
                        onChange={handlePhoneChange}
                        maxLength={18}
                        className="w-full px-3 py-2.5 glass rounded-lg border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500/50 bg-black/20"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Введите только цифры номера телефона
                      </p>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  className="w-full px-5 py-3.5 glass-strong rounded-xl font-black text-sm text-white border border-white/20 shadow-[0_4px_20px_rgba(255,0,102,0.3)] flex items-center justify-center space-x-2"
                >
                  <CreditCard size={18} />
                  <span>Оплатить {selectedService.price}₽</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowPaymentForm(false);
                    haptic.selection();
                  }}
                  className="w-full px-5 py-2.5 glass rounded-xl font-bold text-xs text-gray-300 border border-white/10"
                >
                  Отмена
                </motion.button>
              </motion.div>
            )}
            </motion.div>
          )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="pt-14 px-4 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
