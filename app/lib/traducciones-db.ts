import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";

const COLLECTION = "traducciones";

export interface Traduccion {
  id?: string;
  tipo: "landing" | "blog" | "producto"; // Tipo de contenido
  contenidoId: string; // ID del contenido original
  idiomaCodigo: string; // Código del idioma (ej: "es", "en")
  campo: string; // Campo específico (ej: "titulo", "descripcion", "subtitulo")
  valor: string; // Texto traducido
  createdAt?: number;
  updatedAt?: number;
}

// Obtener traducciones por tipo de contenido y idioma
export async function obtenerTraduccionesPorContenido(
  tipo: string,
  contenidoId: string,
  idiomaCodigo: string
): Promise<Traduccion[]> {
  const q = query(
    collection(db, COLLECTION),
    where("tipo", "==", tipo),
    where("contenidoId", "==", contenidoId),
    where("idiomaCodigo", "==", idiomaCodigo)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Traduccion));
}

// Obtener traducción específica
export async function obtenerTraduccion(
  tipo: string,
  contenidoId: string,
  idiomaCodigo: string,
  campo: string
): Promise<Traduccion | null> {
  const q = query(
    collection(db, COLLECTION),
    where("tipo", "==", tipo),
    where("contenidoId", "==", contenidoId),
    where("idiomaCodigo", "==", idiomaCodigo),
    where("campo", "==", campo)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Traduccion;
}

// Obtener todas las traducciones de un contenido
export async function obtenerTodasTraduccionesContenido(
  tipo: string,
  contenidoId: string
): Promise<Traduccion[]> {
  const q = query(
    collection(db, COLLECTION),
    where("tipo", "==", tipo),
    where("contenidoId", "==", contenidoId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Traduccion));
}

// Crear traducción
export async function crearTraduccion(traduccion: Omit<Traduccion, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...traduccion,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  return docRef.id;
}

// Actualizar traducción
export async function actualizarTraduccion(id: string, traduccion: Partial<Traduccion>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...traduccion,
    updatedAt: Date.now()
  });
}

// Eliminar traducción
export async function eliminarTraduccion(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Guardar múltiples traducciones a la vez
export async function guardarTraduccionesMultiples(
  traducciones: Omit<Traduccion, "id">[]
): Promise<void> {
  const batch = traducciones.map(t => crearTraduccion(t));
  await Promise.all(batch);
}

// Eliminar todas las traducciones de un contenido
export async function eliminarTraduccionesContenido(
  tipo: string,
  contenidoId: string
): Promise<void> {
  const q = query(
    collection(db, COLLECTION),
    where("tipo", "==", tipo),
    where("contenidoId", "==", contenidoId)
  );
  const snapshot = await getDocs(q);
  const batch = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(batch);
}

// Obtener traducciones en batch para múltiples contenidos
export async function obtenerTraduccionesBatch(
  tipo: string,
  contenidoIds: string[],
  idiomaCodigo: string
): Promise<Map<string, Map<string, string>>> {
  if (contenidoIds.length === 0) return new Map();
  
  const q = query(
    collection(db, COLLECTION),
    where("tipo", "==", tipo),
    where("contenidoId", "in", contenidoIds),
    where("idiomaCodigo", "==", idiomaCodigo)
  );
  
  const snapshot = await getDocs(q);
  const resultado = new Map<string, Map<string, string>>();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data() as Traduccion;
    if (!resultado.has(data.contenidoId)) {
      resultado.set(data.contenidoId, new Map());
    }
    resultado.get(data.contenidoId)!.set(data.campo, data.valor);
  });
  
  return resultado;
}
