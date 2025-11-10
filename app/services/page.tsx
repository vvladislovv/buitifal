"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Service } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Clock, Tag } from "lucide-react";
import { useTelegramHaptic } from "@/lib/telegram";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const haptic = useTelegramHaptic();
  const router = useRouter();

  useEffect(() => {
    setServices(storage.getServices());
  }, []);

  const categories = ["all", ...Array.from(new Set(services.map((s) => s.category)))];
  const categoryNames: Record<string, string> = {
    all: "Все",
    haircut: "Стрижки",
    beard: "Борода",
    shave: "Бритье",
    styling: "Укладка",
    coloring: "Окрашивание",
    complex: "Комплексы",
  };

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="pt-14 px-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl font-black text-white mb-1">
            Каталог услуг
          </h1>
          <p className="text-sm text-gray-400">
            Выберите услугу, которая вам подходит
          </p>
        </motion.div>

        {/* Фильтры категорий - горизонтальный скролл */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCategory(category);
                haptic.selection();
              }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "glass-strong border border-white/20 shadow-[0_2px_12px_rgba(255,0,102,0.3)]"
                  : "glass border border-white/10"
              }`}
            >
              {categoryNames[category] || category}
            </motion.button>
          ))}
        </div>

        {/* Список услуг */}
        <div className="space-y-2.5">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                haptic.impact("light");
                router.push(`/booking?service=${service.id}`);
              }}
              className="glass rounded-xl p-4 border border-white/10 flex items-start gap-3 active:glass-strong cursor-pointer"
            >
              <div className="text-5xl flex-shrink-0">{service.emoji}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white mb-1">
                  {service.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2.5 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-3 mb-2.5 text-[10px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{service.duration} мин</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-400">
                    <Tag size={12} />
                    <span>{categoryNames[service.category]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                  <span className="text-xl font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                    {service.price}₽
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      haptic.impact("medium");
                      router.push(`/booking?service=${service.id}`);
                    }}
                    className="px-4 py-2 glass-strong rounded-lg font-black text-xs text-white border border-white/20 shadow-[0_2px_10px_rgba(255,0,102,0.3)]"
                  >
                    Записаться
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
