import { useLanguage } from "../context/LanguageContext";
import { obtenerTraduccion } from "../lib/traducciones-db";
import { useState, useEffect } from "react";

export function useTranslation(tipo: string, contenidoId: string, campo: string, valorOriginal: string) {
  const { idiomaActual } = useLanguage();
  const [traduccion, setTraduccion] = useState<string>(valorOriginal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarTraduccion = async () => {
      if (!idiomaActual || idiomaActual.esPredeterminado) {
        setTraduccion(valorOriginal);
        return;
      }

      setLoading(true);
      try {
        const trad = await obtenerTraduccion(tipo, contenidoId, idiomaActual.codigo, campo);
        setTraduccion(trad?.valor || valorOriginal);
      } catch (error) {
        console.error("Error cargando traducción:", error);
        setTraduccion(valorOriginal);
      } finally {
        setLoading(false);
      }
    };

    cargarTraduccion();
  }, [tipo, contenidoId, campo, valorOriginal, idiomaActual]);

  return { traduccion, loading };
}
