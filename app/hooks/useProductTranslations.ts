"use client";

import { useState, useEffect } from "react";
import { obtenerTraduccionesPorContenido } from "../lib/traducciones-db";

interface ProductTranslations {
  nombre?: string;
  descripcion?: string;
}

export function useProductTranslations(
  productId: string | undefined,
  languageCode: string
) {
  const [translations, setTranslations] = useState<ProductTranslations>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId || languageCode === "es") {
      setTranslations({});
      return;
    }

    const loadTranslations = async () => {
      setLoading(true);
      try {
        const traducciones = await obtenerTraduccionesPorContenido(
          "producto",
          productId,
          languageCode
        );
        
        const traduccionesMap: ProductTranslations = {};
        traducciones.forEach(t => {
          if (t.campo === "nombre") {
            traduccionesMap.nombre = t.valor;
          } else if (t.campo === "descripcion") {
            traduccionesMap.descripcion = t.valor;
          }
        });
        
        setTranslations(traduccionesMap);
      } catch (error) {
        console.error("Error cargando traducciones del producto:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [productId, languageCode]);

  return { translations, loading };
}