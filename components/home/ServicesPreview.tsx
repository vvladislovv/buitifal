"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Service } from "@/lib/types";
import { useTelegramHaptic } from "@/lib/telegram";

export function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);
  const haptic = useTelegramHaptic();

  useEffect(() => {
    setServices(storage.getServices().slice(0, 3));
  }, []);

  return (
    <div className="px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-4"
        >
          <div>
            <h2 className="text-xl font-black text-white mb-0.5">
              Наши услуги
            </h2>
            <p className="text-xs text-gray-400">
              Широкий спектр услуг
            </p>
          </div>
          <Link href="/services" onClick={() => haptic.selection()}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center border border-white/10"
            >
              <ArrowRight size={16} className="text-white" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="space-y-2.5">
          {services.map((service, index) => (
            <Link key={service.id} href={`/services#${service.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => haptic.impact("light")}
                className="glass rounded-xl p-3 border border-white/10 flex items-center gap-3"
              >
                <div className="text-4xl flex-shrink-0">{service.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-white mb-0.5">
                    {service.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 mb-1.5 line-clamp-1">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                      {service.price}₽
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {service.duration} мин
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
