"use client";

import { useEffect } from "react";
import { useTelegram } from "@/lib/telegram";

export function TelegramInit() {
  const { webApp } = useTelegram();

  useEffect(() => {
    // Загружаем скрипт Telegram Web App, если он еще не загружен
    if (typeof window !== "undefined" && !window.Telegram?.WebApp) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (webApp) {
      // Настраиваем цвета приложения
      webApp.setHeaderColor("#000000");
      webApp.setBackgroundColor("#000000");
      
      // Включаем расширенный режим
      webApp.expand();
      
      // Отключаем подтверждение закрытия
      webApp.enableClosingConfirmation();
    }
  }, [webApp]);

  return null;
}

