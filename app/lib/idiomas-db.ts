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

const COLLECTION = "idiomas";

export interface Idioma {
  id?: string;
  nombre: string; // Nombre del idioma (ej: "Español", "Inglés")
  codigo: string; // Código ISO (ej: "es", "en")
  bandera: string; // Emoji o nombre de bandera (ej: "🇪🇨", "🇺🇸")
  esPredeterminado: boolean; // Si es el idioma por defecto
  activo: boolean; // Si está activo para selección pública
  createdAt?: number;
}

// Obtener todos los idiomas
export async function obtenerIdiomas(): Promise<Idioma[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idioma));
}

// Obtener idioma por ID
export async function obtenerIdiomaPorId(id: string): Promise<Idioma | null> {
  const docSnap = await getDoc(doc(db, COLLECTION, id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Idioma;
}

// Obtener idioma por código
export async function obtenerIdiomaPorCodigo(codigo: string): Promise<Idioma | null> {
  const q = query(collection(db, COLLECTION), where("codigo", "==", codigo));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Idioma;
}

// Obtener idioma predeterminado
export async function obtenerIdiomaPredeterminado(): Promise<Idioma | null> {
  const q = query(collection(db, COLLECTION), where("esPredeterminado", "==", true));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Idioma;
}

// Obtener idiomas activos
export async function obtenerIdiomasActivos(): Promise<Idioma[]> {
  const q = query(collection(db, COLLECTION), where("activo", "==", true), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idioma));
}

// Crear idioma
export async function crearIdioma(idioma: Omit<Idioma, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...idioma,
    createdAt: Date.now()
  });
  return docRef.id;
}

// Actualizar idioma
export async function actualizarIdioma(id: string, idioma: Partial<Idioma>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), idioma);
}

// Eliminar idioma
export async function eliminarIdioma(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
