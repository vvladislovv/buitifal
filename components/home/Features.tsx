"use client";

import { motion } from "framer-motion";
import { Bell, Calendar, Gift, Clock } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Онлайн запись",
    description: "Выберите удобное время",
    color: "from-primary-600 to-accent-600",
  },
  {
    icon: Bell,
    title: "Напоминания",
    description: "Никогда не пропустите",
    color: "from-accent-600 to-primary-600",
  },
  {
    icon: Gift,
    title: "Бонусы",
    description: "Получайте кэшбэк",
    color: "from-primary-600 to-accent-600",
  },
  {
    icon: Clock,
    title: "Экономия времени",
    description: "Быстрая запись",
    color: "from-accent-600 to-primary-600",
  },
];

export function Features() {
  return (
    <div className="px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-xl font-black text-white mb-1">
            Преимущества
          </h2>
          <p className="text-xs text-gray-400">
            Все что нужно для комфортной записи
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-2.5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-3 border border-white/10"
              >
                <div className={`inline-flex p-1.5 rounded-lg bg-gradient-to-br ${feature.color} mb-2`}>
                  <Icon className="text-white" size={14} />
                </div>
                <h3 className="text-sm font-black text-white mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
