"use client";

import { useState, useEffect } from "react";
import { translations, type Language } from "@/i18n/translations";

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Tarayıcı dilini al veya localStorage'dan kayıtlı dili al
    const savedLang = localStorage.getItem("language") as Language;
    const browserLang = navigator.language.split("-")[0] as Language;
    const defaultLang = savedLang || browserLang || "en";

    // Eğer desteklenen bir dil ise kullan
    if (defaultLang in translations) {
      setLanguage(defaultLang);
    }
  }, []);

  const t = (key: string) => {
    // key'i nokta notasyonuna göre böl (örn: "common.settings")
    const keys = key.split(".");
    let translation = translations[language];

    // Her bir key seviyesini kontrol et
    for (const k of keys) {
      if (translation && typeof translation === "object" && k in translation) {
        translation = translation[k as keyof typeof translation];
      } else {
        // Çeviri bulunamazsa İngilizce versiyonunu dene
        translation = getEnglishFallback(keys);
        break;
      }
    }

    // Eğer çeviri bir string değilse veya bulunamazsa key'i göster
    return typeof translation === "string" ? translation : key;
  };

  const getEnglishFallback = (keys: string[]) => {
    let value = translations["en"];
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return undefined;
      }
    }
    return typeof value === "string" ? value : undefined;
  };

  const changeLanguage = (newLang: Language) => {
    if (newLang in translations) {
      setLanguage(newLang);
      localStorage.setItem("language", newLang);
      // Sayfayı yeniden yükle
      window.location.reload();
    }
  };

  return {
    t,
    language,
    changeLanguage,
    availableLanguages: Object.keys(translations) as Language[],
  };
}
