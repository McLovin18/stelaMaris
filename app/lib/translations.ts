/**
 * Utilidades para manejo de multi-idioma
 * Soporta estructura de traducciones para campos de texto
 */

export type TranslatableText = string | Record<string, string>;

/**
 * Obtiene el texto en el idioma actual
 * @param text - Puede ser un string simple o un objeto con traducciones por código de idioma
 * @param languageCode - Código del idioma actual (ej: "es", "en")
 * @param fallbackText - Texto alternativo si no hay traducción
 * @returns El texto en el idioma solicitado o el fallback
 */
export function getText(
  text: TranslatableText | undefined,
  languageCode: string,
  fallbackText?: string
): string {
  if (!text) return fallbackText || "";
  
  // Si es un string simple, retornarlo
  if (typeof text === "string") return text;
  
  // Si es un objeto con traducciones
  if (typeof text === "object") {
    // Buscar traducción exacta
    if (text[languageCode]) return text[languageCode];
    
    // Si no hay traducción exacta, buscar en español como fallback
    if (text["es"]) return text["es"];
    
    // Si no hay español, usar el primer valor disponible
    const firstValue = Object.values(text)[0];
    if (firstValue) return firstValue;
  }
  
  return fallbackText || "";
}

/**
 * Crea un objeto de traducciones desde un string simple
 * Útil para migrar datos existentes
 */
export function createTranslation(
  text: string,
  languageCode: string = "es"
): Record<string, string> {
  return { [languageCode]: text };
}

/**
 * Normaliza un campo para que siempre tenga la estructura de traducciones
 */
export function normalizeTranslation(
  text: TranslatableText | undefined,
  defaultLanguage: string = "es"
): Record<string, string> {
  if (!text) return { [defaultLanguage]: "" };
  
  if (typeof text === "string") {
    return { [defaultLanguage]: text };
  }
  
  if (typeof text === "object") {
    return text;
  }
  
  return { [defaultLanguage]: "" };
}

/**
 * Establece o actualiza una traducción en un objeto de traducciones
 */
export function setTranslation(
  translations: Record<string, string> | undefined,
  languageCode: string,
  text: string
): Record<string, string> {
  const normalized = normalizeTranslation(translations, languageCode);
  normalized[languageCode] = text;
  return normalized;
}

/**
 * Verifica si un campo tiene traducciones múltiples
 */
export function isMultiLanguage(text: TranslatableText): boolean {
  if (!text) return false;
  if (typeof text === "string") return false;
  return Object.keys(text).length > 1;
}
