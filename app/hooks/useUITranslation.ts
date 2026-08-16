"use client";

import { useLanguage } from "../context/LanguageContext";
import { getUITranslation } from "../lib/ui-translations";

/**
 * Hook para obtener traducciones de la UI
 */
export function useUITranslation() {
  const { idiomaActual } = useLanguage();
  const languageCode = idiomaActual?.codigo || "es";

  const t = (key: string): string => {
    return getUITranslation(key, languageCode);
  };

  return { t, languageCode };
}