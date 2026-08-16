"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSelector = () => {
  const { idiomaActual, idiomasDisponibles, cambiarIdioma, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || idiomasDisponibles.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-white hover:bg-white/15 hover:shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        aria-label="Seleccionar idioma"
      >
        <span className="text-2xl drop-shadow-sm">{idiomaActual?.bandera || "🌐"}</span>
        <span className="hidden sm:inline text-sm font-medium tracking-wide">{idiomaActual?.nombre || "Idioma"}</span>
        <span 
          className="material-icons-round text-sm transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-300"
            style={{
              background: "#FFFFFF",
              border: "2px solid var(--color-border)",
              boxShadow: "0 10px 40px rgba(200, 101, 129, 0.15)",
            }}
          >
            {/* Header del dropdown */}
            <div 
              className="px-4 py-3 border-b"
              style={{ 
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-active) 100%)",
                borderColor: "var(--color-border)"
              }}
            >
              <p className="text-xs font-semibold tracking-wider uppercase text-white/90">
                Seleccionar idioma
              </p>
            </div>

            {/* Lista de idiomas */}
            <div className="p-2">
              {idiomasDisponibles.map((idioma) => (
                <button
                  key={idioma.id}
                  onClick={() => {
                    cambiarIdioma(idioma.codigo);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    idiomaActual?.id === idioma.id
                      ? "shadow-md"
                      : "hover:shadow-sm"
                  }`}
                  style={{
                    background: idiomaActual?.id === idioma.id 
                      ? "linear-gradient(135deg, var(--color-primary) 0%, var(--color-active) 100%)"
                      : "transparent",
                    color: idiomaActual?.id === idioma.id ? "#FFFFFF" : "#334155",
                    fontWeight: idiomaActual?.id === idioma.id ? "600" : "400",
                  }}
                >
                  <span className="text-2xl drop-shadow-sm">{idioma.bandera}</span>
                  <span className="flex-1">{idioma.nombre}</span>
                  {idiomaActual?.id === idioma.id && (
                    <span 
                      className="material-icons-round ml-auto"
                      style={{ color: "#FFFFFF" }}
                    >
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer del dropdown */}
            <div 
              className="px-4 py-2 border-t text-center"
              style={{ 
                background: "var(--color-background)",
                borderColor: "var(--color-border)"
              }}
            >
              <p className="text-xs" style={{ color: "var(--color-border)" }}>
                🌍 Traducción instantánea
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
