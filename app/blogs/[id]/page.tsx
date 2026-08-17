"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { redirectIfLoggedIn } from "../../lib/firebase-auth";
import { getBlogById } from "../../lib/blogs-db";
import type { Blog } from "../../lib/blog-types";
import BlogPreview from "../BlogPreview";
import { useLanguage } from "../../context/LanguageContext";
import { obtenerTraduccionesPorContenido } from "../../lib/traducciones-db";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { idiomaActual } = useLanguage();
  const languageCode = idiomaActual?.codigo || "es";
  const [blog, setBlog] = useState<Blog | null>(null);
  const [translatedBlog, setTranslatedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function load() {
      if (!params?.id) return;
      setLoading(true);
      const data = await getBlogById(params.id as string);
      setBlog(data);
      setLoading(false);
    }
    load();
  }, [params?.id]);

  // Cargar traducciones cuando cambia el idioma
  useEffect(() => {
    const loadTranslations = async () => {
      if (!blog || !blog.id) return;

      const idiomaPredeterminado = "es";

      if (languageCode === idiomaPredeterminado) {
        // Si es español, usar el blog original
        setTranslatedBlog(blog);
        return;
      }

      try {
        const trads = await obtenerTraduccionesPorContenido("blog", blog.id, languageCode);

        if (trads.length === 0) {
          setTranslatedBlog(blog);
          return;
        }

        const blogTraducido = JSON.parse(JSON.stringify(blog));

        trads.forEach(t => {
          if (t.campo === "title") {
            blogTraducido.title = t.valor;
          } else if (t.campo === "description") {
            blogTraducido.description = t.valor;
          }
        });

        setTranslatedBlog(blogTraducido);
      } catch (error) {
        console.error("Error cargando traducciones:", error);
        setTranslatedBlog(blog);
      }
    };

    loadTranslations();
  }, [blog, languageCode]);

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
      className="min-h-screen flex flex-col"
    >
      <main className="max-w-3xl mx-auto px-4 py-8 lg:px-6 flex-1 w-full">
        {loading ? (
          <div className="text-center py-16">
            <span
              className="material-icons-round animate-spin text-4xl"
              style={{ color: "var(--textSecondary)" }}
            >
              sync
            </span>
            <p className="mt-4" style={{ color: "var(--textSecondary)" }}>
              Cargando artículo...
            </p>
          </div>
        ) : !translatedBlog ? (
          <div className="text-center py-16">
            <span
              className="material-icons-round text-6xl opacity-30"
              style={{ color: "var(--textSecondary)" }}
            >
              article
            </span>
            <h2 className="text-2xl font-bold mt-4" style={{ color: "var(--text)" }}>
              Artículo no encontrado
            </h2>
          </div>
        ) : (
          <BlogPreview blog={translatedBlog} device="desktop" />
        )}
      </main>
    </div>
  );
}
