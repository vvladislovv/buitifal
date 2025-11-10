"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Sparkles } from "lucide-react";
import { useTelegramHaptic } from "@/lib/telegram";

export function Hero() {
  const haptic = useTelegramHaptic();

  return (
    <div className="relative pt-16 pb-6 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 via-accent-600/5 to-primary-600/5" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-3"
          >
            ✂️
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black mb-3 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent block">
              Добро пожаловать
            </span>
            <span className="text-white block">в наш салон</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-400 mb-6 max-w-sm mx-auto"
          >
            Современный барбершоп с профессиональными мастерами
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-2.5 justify-center items-center px-4"
          >
            <Link href="/booking" className="w-full max-w-xs">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => haptic.impact("medium")}
                className="w-full px-5 py-3.5 glass-strong rounded-xl font-black text-sm text-white flex items-center justify-center space-x-2 border border-white/20 shadow-[0_4px_20px_rgba(255,0,102,0.3)]"
              >
                <Calendar size={18} />
                <span>Записаться онлайн</span>
              </motion.button>
            </Link>
            
            <Link href="/services" className="w-full max-w-xs">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => haptic.selection()}
                className="w-full px-5 py-3.5 glass rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 border border-white/10 hover:border-white/20 transition-colors"
              >
                <Sparkles size={18} />
                <span>Наши услуги</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
