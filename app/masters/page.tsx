"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Master } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Star, Briefcase, Users } from "lucide-react";
import { useTelegramHaptic } from "@/lib/telegram";

export default function MastersPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const haptic = useTelegramHaptic();

  useEffect(() => {
    // Загружаем данные
    const loadMasters = () => {
      try {
        if (typeof window !== "undefined") {
          const mastersData = storage.getMasters();
          setMasters(mastersData || []);
        } else {
          // Для SSR используем пустой массив, данные загрузятся на клиенте
          setMasters([]);
        }
      } catch (error) {
        console.error("Error loading masters:", error);
        // Если ошибка, загружаем дефолтные данные
        try {
          const defaultMasters = storage.getMasters();
          setMasters(defaultMasters || []);
        } catch (e) {
          setMasters([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Задержка для гарантии что localStorage доступен
    const timer = setTimeout(() => {
      loadMasters();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-14 px-4 pb-32 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4 animate-pulse">✂️</div>
          <p className="text-gray-400">Загрузка...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-14 px-4 pb-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl font-black text-white mb-1">
            Наши мастера
          </h1>
          <p className="text-sm text-gray-400">
            Профессионалы с многолетним опытом
          </p>
        </motion.div>

        {masters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-8 text-center border border-white/10"
          >
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-black text-white mb-2">
              Мастера не найдены
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Попробуйте обновить страницу
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic.impact("medium");
                window.location.reload();
              }}
              className="px-5 py-2.5 glass-strong rounded-lg font-black text-xs text-white border border-white/20"
            >
              Обновить
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {masters.map((master, index) => (
            <motion.div
              key={master.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="glass rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-start gap-3">
                <div className="text-6xl flex-shrink-0">{master.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-black text-white">{master.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={14} />
                      <span className="text-base font-black text-white">
                        {master.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-2 text-[10px] text-gray-400">
                    <Briefcase size={12} />
                    <span>{master.experience} лет опыта</span>
                  </div>

                  <p className="text-xs text-gray-400 mb-2.5">{master.bio}</p>

                  <div className="mb-2.5">
                    <div className="text-[10px] text-gray-500 mb-1">Портфолио:</div>
                    <div className="flex gap-1.5">
                      {master.portfolio.map((item, idx) => (
                        <span key={idx} className="text-xl">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-[10px] text-gray-500 mb-1">Специализация:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {master.specialization.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 glass-light rounded-lg text-[10px] text-primary-400 border border-primary-600/30"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      haptic.impact("medium");
                      window.location.href = `/booking?master=${master.id}`;
                    }}
                    className="w-full px-4 py-2.5 glass-strong rounded-lg font-black text-xs text-white border border-white/20 shadow-[0_2px_12px_rgba(255,0,102,0.3)]"
                  >
                    Записаться к мастеру
                  </motion.button>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
