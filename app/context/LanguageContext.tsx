"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { obtenerIdiomasActivos, obtenerIdiomaPredeterminado, obtenerIdiomaPorCodigo, obtenerIdiomas, crearIdioma } from "../lib/idiomas-db";
import type { Idioma } from "../lib/idiomas-db";

interface LanguageContextType {
  idiomaActual: Idioma | null;
  idiomasDisponibles: Idioma[];
  cambiarIdioma: (codigo: string) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "idioma_seleccionado";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [idiomaActual, setIdiomaActual] = useState<Idioma | null>(null);
  const [idiomasDisponibles, setIdiomasDisponibles] = useState<Idioma[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarIdiomas();
  }, []);

  const cargarIdiomas = async () => {
    try {
      setIsLoading(true);
      
      // Cargar todos los idiomas
      const todosIdiomas = await obtenerIdiomas();
      
      // Si no hay idiomas, crear español automáticamente
      if (todosIdiomas.length === 0) {
        try {
          await crearIdioma({
            nombre: "Español",
            codigo: "es",
            bandera: "🇪🇨",
            esPredeterminado: true,
            activo: true,
          });
          console.log("Idioma español creado automáticamente como predeterminado");
          // Recargar idiomas después de crear
          const idiomasCreados = await obtenerIdiomas();
          setIdiomasDisponibles(idiomasCreados);
          const idiomaEspañol = idiomasCreados[0];
          setIdiomaActual(idiomaEspañol);
          localStorage.setItem(STORAGE_KEY, idiomaEspañol.codigo);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error("Error creando idioma español automáticamente:", error);
        }
      }
      
      // Cargar idiomas disponibles (activos)
      const idiomas = await obtenerIdiomasActivos();
      setIdiomasDisponibles(idiomas);

      // Intentar recuperar idioma guardado
      const idiomaGuardado = localStorage.getItem(STORAGE_KEY);
      let idiomaSeleccionado: Idioma | null = null;

      if (idiomaGuardado) {
        idiomaSeleccionado = await obtenerIdiomaPorCodigo(idiomaGuardado);
      }

      // Si no hay idioma guardado o no existe, usar el predeterminado
      if (!idiomaSeleccionado) {
        const predeterminado = await obtenerIdiomaPredeterminado();
        idiomaSeleccionado = predeterminado || (idiomas.length > 0 ? idiomas[0] : null);
      }

      if (idiomaSeleccionado) {
        setIdiomaActual(idiomaSeleccionado);
        localStorage.setItem(STORAGE_KEY, idiomaSeleccionado.codigo);
      }
    } catch (error) {
      console.error("Error cargando idiomas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cambiarIdioma = async (codigo: string) => {
    try {
      const nuevoIdioma = await obtenerIdiomaPorCodigo(codigo);
      if (nuevoIdioma) {
        setIdiomaActual(nuevoIdioma);
        localStorage.setItem(STORAGE_KEY, codigo);
      }
    } catch (error) {
      console.error("Error cambiando idioma:", error);
    }
  };

  return (
    <LanguageContext.Provider value={{ idiomaActual, idiomasDisponibles, cambiarIdioma, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage debe ser usado dentro de un LanguageProvider");
  }
  return context;
}
