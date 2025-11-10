"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scissors, Users, Calendar, Gift, History } from "lucide-react";
import { motion } from "framer-motion";
import { useTelegramHaptic } from "@/lib/telegram";

const navItems = [
  { href: "/", icon: Home, label: "Главная" },
  { href: "/services", icon: Scissors, label: "Услуги" },
  { href: "/masters", icon: Users, label: "Мастера" },
  { href: "/booking", icon: Calendar, label: "Запись" },
  { href: "/loyalty", icon: Gift, label: "Бонусы" },
  { href: "/history", icon: History, label: "История" },
];

export function Navigation() {
  const pathname = usePathname();
  const haptic = useTelegramHaptic();

  return (
    <>
      {/* Top Navigation - только логотип */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass safe-area-top" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-12">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={() => haptic.selection()}
            >
              <span className="text-lg">✂️</span>
              <span className="text-sm font-black bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent">
                Beauty Salon
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Floating Bottom Navigation - островок с закруглениями */}
      <div className="fixed bottom-4 left-4 right-4 z-50 safe-area-bottom">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="glass rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <div className="flex items-center justify-around px-2 py-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => haptic.selection()}
                  className="flex flex-col items-center justify-center min-w-0 flex-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all mb-0.5 ${
                      isActive
                        ? "bg-gradient-to-br from-primary-600 to-accent-600 shadow-[0_4px_12px_rgba(255,0,102,0.4)] border border-white/20"
                        : "bg-transparent"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}
