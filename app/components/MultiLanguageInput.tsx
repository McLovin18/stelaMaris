"use client";

import React, { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { normalizeTranslation, setTranslation } from "../lib/translations";
import type { TranslatableText } from "../lib/translations";

export type MultiLanguageInputProps = {
  value: TranslatableText | undefined;
  onChange: (value: TranslatableText) => void;
  label?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  className?: string;
  required?: boolean;
};

export default function MultiLanguageInput({
  value,
  onChange,
  label,
  placeholder = "Enter text...",
  textarea = false,
  rows = 3,
  className = "",
  required = false,
}: MultiLanguageInputProps) {
  const { idiomasDisponibles, idiomaActual } = useLanguage();
  
  const currentLanguageCode = idiomaActual?.codigo || "es";
  
  // Local state for input values to prevent parent re-renders on every keystroke
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  
  // Ref to track if user is currently editing to prevent overwriting
  const isEditingRef = useRef(false);
  
  // Ref to store previous value to detect external changes
  const prevValueRef = useRef(value);
  
  // Sync local values with prop value when it changes from outside (not from user editing)
  useEffect(() => {
    // Only sync if the value actually changed and user is not editing
    if (prevValueRef.current !== value && !isEditingRef.current) {
      const normalized = normalizeTranslation(value, "es");
      setLocalValues(normalized);
    }
    prevValueRef.current = value;
  }, [value]);
  
  // Memoize sorted languages to prevent resorting on every render
  const sortedLanguages = useMemo(() => {
    return [...idiomasDisponibles].sort((a, b) => {
      if (a.codigo === currentLanguageCode) return -1;
      if (b.codigo === currentLanguageCode) return 1;
      return a.nombre.localeCompare(b.nombre);
    });
  }, [idiomasDisponibles, currentLanguageCode]);
  
  // Update local state on input change
  const handleChange = useCallback((languageCode: string, text: string) => {
    isEditingRef.current = true;
    setLocalValues(prev => ({
      ...prev,
      [languageCode]: text
    }));
  }, []);
  
  // Update parent on blur to avoid re-renders during typing
  const handleBlur = useCallback(() => {
    isEditingRef.current = false;
    onChange(localValues);
  }, [localValues, onChange]);
  
  if (sortedLanguages.length === 0) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="text"
          value={typeof value === "string" ? value : value?.es || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        />
      </div>
    );
  }
  
  const InputComponent = textarea ? "textarea" : "input";
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="space-y-3">
        {sortedLanguages.map((idioma) => {
          const isCurrentLanguage = idioma.codigo === currentLanguageCode;
          const inputValue = localValues[idioma.codigo] || "";
          
          return (
            <div key={idioma.id} className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{idioma.bandera}</span>
                <span className="text-sm font-medium">
                  {idioma.nombre}
                  {isCurrentLanguage && (
                    <span className="ml-2 text-xs text-blue-600 font-normal">
                      (Current)
                    </span>
                  )}
                </span>
                {isCurrentLanguage && required && !inputValue && (
                  <span className="text-red-500 text-xs ml-auto">Required</span>
                )}
              </div>
              <InputComponent
                value={inputValue}
                onChange={(e) => handleChange(idioma.codigo, e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder}
                rows={textarea ? rows : undefined}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isCurrentLanguage 
                    ? "border-blue-300 bg-blue-50" 
                    : "border-gray-300"
                }`}
                required={isCurrentLanguage && required}
              />
            </div>
          );
        })}
      </div>
      
      {sortedLanguages.length > 1 && (
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Fill in the current language first. Other languages are optional.
        </p>
      )}
    </div>
  );
}

export { MultiLanguageInput };
