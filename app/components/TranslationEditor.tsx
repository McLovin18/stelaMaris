"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

interface TranslationEditorProps {
  onIdiomaChange?: (idiomaCodigo: string) => void;
  idiomaActual?: string;
  soloEdicion?: boolean; // Si es true, no cambia el idioma global de la app
}

export const TranslationEditor: React.FC<TranslationEditorProps> = ({
  onIdiomaChange,
  idiomaActual: propIdiomaActual,
  soloEdicion = false
}) => {
  const { idiomaActual, idiomasDisponibles, cambiarIdioma, isLoading } = useLanguage();
  const [idiomaSeleccionado, setIdiomaSeleccionado] = useState<string>(propIdiomaActual || idiomaActual?.codigo || "");

  useEffect(() => {
    if (propIdiomaActual) {
      setIdiomaSeleccionado(propIdiomaActual);
    } else if (idiomaActual) {
      setIdiomaSeleccionado(idiomaActual.codigo);
    }
  }, [propIdiomaActual, idiomaActual]);

  const handleIdiomaChange = (codigo: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIdiomaSeleccionado(codigo);
    // No cambiar el idioma global del usuario, solo el de edición
    onIdiomaChange?.(codigo);
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando idiomas...</div>;
  }

  // Solo mostrar idiomas que NO son predeterminados para traducción
  const idiomasParaTraducir = idiomasDisponibles.filter(id => !id.esPredeterminado);
  const idiomaPredeterminado = idiomasDisponibles.find(id => id.esPredeterminado);

  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Idioma de edición</h3>
      
      {/* Selector de idioma */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar idioma para editar contenido
        </label>
        <div className="flex flex-wrap gap-2">
          {/* Idioma predeterminado (para editar contenido original) */}
          {idiomaPredeterminado && (
            <button
              key={idiomaPredeterminado.id}
              onClick={(e) => handleIdiomaChange(idiomaPredeterminado.codigo, e)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                idiomaSeleccionado === idiomaPredeterminado.codigo
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{idiomaPredeterminado.bandera}</span>
              <span className="text-sm font-medium">{idiomaPredeterminado.nombre}</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Original
              </span>
            </button>
          )}
          
          {/* Idiomas para traducir */}
          {idiomasParaTraducir.map(idioma => (
            <button
              key={idioma.id}
              onClick={(e) => handleIdiomaChange(idioma.codigo, e)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                idiomaSeleccionado === idioma.codigo
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{idioma.bandera}</span>
              <span className="text-sm font-medium">{idioma.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {idiomaSeleccionado && (
          <p>
            {idiomaSeleccionado === idiomaPredeterminado?.codigo 
              ? "Editando contenido original (idioma predeterminado)" 
              : `Traduciendo al: ${idiomasDisponibles.find(i => i.codigo === idiomaSeleccionado)?.nombre}`}
          </p>
        )}
      </div>
    </div>
  );
};
