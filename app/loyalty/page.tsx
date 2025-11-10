"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Gift, Star, TrendingUp, Coins } from "lucide-react";

const levelInfo = {
  bronze: { name: "Бронза", color: "from-amber-600 to-amber-800", min: 0, cashback: 0 },
  silver: { name: "Серебро", color: "from-gray-400 to-gray-600", min: 5000, cashback: 5 },
  gold: { name: "Золото", color: "from-yellow-400 to-yellow-600", min: 10000, cashback: 10 },
  platinum: { name: "Платина", color: "from-cyan-400 to-cyan-600", min: 20000, cashback: 15 },
};

export default function LoyaltyPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(storage.getUser());
  }, []);

  if (!user) return null;

  const currentLevel = levelInfo[user.loyaltyPoints.level];
  const nextLevel = Object.values(levelInfo).find(
    (l) => l.min > user.loyaltyPoints.totalSpent
  );
  const progress = nextLevel
    ? ((user.loyaltyPoints.totalSpent - currentLevel.min) /
        (nextLevel.min - currentLevel.min)) *
      100
    : 100;

  return (
    <div className="pt-14 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl font-black text-white mb-1">
            Программа лояльности
          </h1>
          <p className="text-sm text-gray-400">
            Копите бонусы и получайте кэшбэк
          </p>
        </motion.div>

        {/* Текущий уровень */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-xl p-4 mb-4 border border-white/20"
        >
          <div className="text-center mb-4">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-3"
            >
              {user.loyaltyPoints.level === "bronze" && "🥉"}
              {user.loyaltyPoints.level === "silver" && "🥈"}
              {user.loyaltyPoints.level === "gold" && "🥇"}
              {user.loyaltyPoints.level === "platinum" && "💎"}
            </motion.div>
            <h2
              className={`text-xl font-black bg-gradient-to-r ${currentLevel.color} bg-clip-text text-transparent mb-1`}
            >
              {currentLevel.name}
            </h2>
            <p className="text-xs text-gray-400">
              Кэшбэк: {user.loyaltyPoints.cashbackPercent}%
            </p>
          </div>

          {/* Прогресс до следующего уровня */}
          {nextLevel && (
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
                <span>До уровня {nextLevel.name}</span>
                <span>
                  {user.loyaltyPoints.totalSpent}₽ / {nextLevel.min}₽
                </span>
              </div>
              <div className="w-full glass-light rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full bg-gradient-to-r ${nextLevel.color} rounded-full`}
                />
              </div>
            </div>
          )}

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <div className="glass-light rounded-lg p-3 text-center border border-white/10">
              <Coins className="mx-auto mb-1.5 text-yellow-400" size={18} />
              <div className="text-xl font-black text-white">
                {user.loyaltyPoints.points}
              </div>
              <div className="text-[10px] text-gray-400">Бонусных баллов</div>
            </div>
            <div className="glass-light rounded-lg p-3 text-center border border-white/10">
              <TrendingUp className="mx-auto mb-1.5 text-primary-400" size={18} />
              <div className="text-xl font-black text-white">
                {user.loyaltyPoints.totalSpent}₽
              </div>
              <div className="text-[10px] text-gray-400">Всего потрачено</div>
            </div>
          </div>
        </motion.div>

        {/* Уровни программы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4 mb-4 border border-white/10"
        >
          <h3 className="text-lg font-black text-white mb-3">Все уровни</h3>
          <div className="space-y-2.5">
            {Object.entries(levelInfo).map(([key, level], index) => {
              const isCurrent = user.loyaltyPoints.level === key;
              const isUnlocked = user.loyaltyPoints.totalSpent >= level.min;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    isCurrent
                      ? "glass-strong border-white/30"
                      : isUnlocked
                      ? "glass-light border-white/10"
                      : "glass border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="text-3xl">
                        {key === "bronze" && "🥉"}
                        {key === "silver" && "🥈"}
                        {key === "gold" && "🥇"}
                        {key === "platinum" && "💎"}
                      </div>
                      <div>
                        <div
                          className={`text-sm font-black bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}
                        >
                          {level.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Кэшбэк {level.cashback}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">От</div>
                      <div className="text-sm font-black text-white">
                        {level.min}₽
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <div className="mt-1.5 text-[10px] text-primary-400 font-bold">
                      ✓ Ваш текущий уровень
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Как получить бонусы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-4 border border-white/10"
        >
          <h3 className="text-lg font-black text-white mb-3 flex items-center">
            <Gift className="mr-2" size={18} />
            Как получить бонусы?
          </h3>
          <div className="space-y-1.5 text-xs text-gray-300">
            <div className="flex items-start space-x-2">
              <span className="text-primary-400">•</span>
              <span>1 бонусный балл = 1₽ при оплате</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary-400">•</span>
              <span>Кэшбэк начисляется автоматически</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary-400">•</span>
              <span>Бонусы можно использовать для оплаты</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary-400">•</span>
              <span>Чем выше уровень, тем больше кэшбэк</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
