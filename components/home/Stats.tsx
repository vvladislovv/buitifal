"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Users, Star } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "40%", label: "Рост записей", color: "from-primary-600 to-accent-600" },
  { icon: Clock, value: "2-3 ч", label: "Экономия времени", color: "from-accent-600 to-primary-600" },
  { icon: Users, value: "15-20%", label: "Снижение неявок", color: "from-primary-600 to-accent-600" },
  { icon: Star, value: "76%", label: "Автоподтверждение", color: "from-accent-600 to-primary-600" },
];

export function Stats() {
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
            Результаты работы
          </h2>
          <p className="text-xs text-gray-400">
            Цифры, которые говорят сами за себя
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
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
                <div className={`inline-flex p-1.5 rounded-lg bg-gradient-to-br ${stat.color} mb-2`}>
                  <Icon className="text-white" size={16} />
                </div>
                <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
