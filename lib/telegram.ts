"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
        };
        version: string;
        platform: string;
        colorScheme: "light" | "dark";
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        sendData: (data: string) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: "default" | "ok" | "close" | "cancel" | "destructive";
            text: string;
          }>;
        }, callback?: (id: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: {
          text?: string;
        }, callback?: (data: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback?: (text: string) => void) => void;
        requestWriteAccess: (callback?: (granted: boolean) => void) => void;
        requestContact: (callback?: (granted: boolean) => void) => void;
        onEvent: (eventType: string, eventHandler: () => void) => void;
        offEvent: (eventType: string, eventHandler: () => void) => void;
      };
    };
  }
}

type TelegramWebApp = NonNullable<Window["Telegram"]>["WebApp"];
type TelegramUser = TelegramWebApp["initDataUnsafe"]["user"];

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      setWebApp(tg);
      setUser(tg.initDataUnsafe.user || null);

      // Устанавливаем цвета темы
      if (tg.themeParams.bg_color) {
        document.documentElement.style.setProperty("--tg-theme-bg-color", tg.themeParams.bg_color);
      }
      if (tg.themeParams.text_color) {
        document.documentElement.style.setProperty("--tg-theme-text-color", tg.themeParams.text_color);
      }
      if (tg.themeParams.button_color) {
        document.documentElement.style.setProperty("--tg-theme-button-color", tg.themeParams.button_color);
      }
      if (tg.themeParams.button_text_color) {
        document.documentElement.style.setProperty("--tg-theme-button-text-color", tg.themeParams.button_text_color);
      }
    }
  }, []);

  return { webApp, user };
}

export function useTelegramBackButton(callback: () => void) {
  const { webApp } = useTelegram();

  useEffect(() => {
    if (!webApp) return;

    webApp.BackButton.show();
    webApp.BackButton.onClick(callback);

    return () => {
      webApp.BackButton.hide();
      webApp.BackButton.offClick(callback);
    };
  }, [webApp, callback]);
}

export function useTelegramMainButton(
  text: string,
  onClick: () => void,
  options?: {
    color?: string;
    textColor?: string;
    isVisible?: boolean;
  }
) {
  const { webApp } = useTelegram();

  useEffect(() => {
    if (!webApp) return;

    webApp.MainButton.setText(text);
    if (options?.color) {
      webApp.MainButton.setParams({
        color: options.color,
        text_color: options.textColor || "#ffffff",
        is_visible: options.isVisible !== false,
      });
    } else {
      webApp.MainButton.setParams({
        is_visible: options?.isVisible !== false,
      });
    }

    webApp.MainButton.onClick(onClick);

    return () => {
      webApp.MainButton.offClick(onClick);
      webApp.MainButton.hide();
    };
  }, [webApp, text, onClick, options]);
}

export function useTelegramHaptic() {
  const { webApp } = useTelegram();

  return {
    impact: (style: "light" | "medium" | "heavy" | "rigid" | "soft" = "medium") => {
      webApp?.HapticFeedback.impactOccurred(style);
    },
    notification: (type: "error" | "success" | "warning" = "success") => {
      webApp?.HapticFeedback.notificationOccurred(type);
    },
    selection: () => {
      webApp?.HapticFeedback.selectionChanged();
    },
  };
}

