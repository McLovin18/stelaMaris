"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading3DIcon } from "../components/Loading3DIcon";
import { getPublishedBlogs } from "../lib/blogs-db";
import { useTracking } from "../lib/useAnalytics";
import type { Blog } from "../lib/blog-types";
import BottomBarPublic from "../components/BottomBarPublic";
import { useLanguage } from "../context/LanguageContext";
import { getText } from "../lib/translations";
import { obtenerTraduccionesPorContenido } from "../lib/traducciones-db";

export default function BlogsPage() {
  const router = useRouter();
  const { trackBlogClick } = useTracking();
  const { idiomaActual } = useLanguage();
  const languageCode = idiomaActual?.codigo || "es";
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [translatedBlogs, setTranslatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getPublishedBlogs();
      setBlogs(data);
      setLoading(false);
    }
    load();
  }, []);

  // Cargar traducciones cuando cambia el idioma
  useEffect(() => {
    const loadTranslations = async () => {
      if (!blogs || blogs.length === 0) return;

      const idiomaPredeterminado = "es";

      if (languageCode === idiomaPredeterminado) {
        // Si es español, usar los blogs originales
        setTranslatedBlogs(blogs);
        return;
      }

      try {
        const blogsTrads = await Promise.all(
          blogs.map(async (blog) => {
            if (!blog.id) return { blogId: blog.id, traducciones: [] };
            const trads = await obtenerTraduccionesPorContenido("blog", blog.id, languageCode);
            return { blogId: blog.id, traducciones: trads };
          })
        );

        const blogsFinal = blogs.map(blog => {
          const trads = blogsTrads.find(t => t.blogId === blog.id)?.traducciones || [];
          if (trads.length === 0) return blog;

          const blogTraducido = JSON.parse(JSON.stringify(blog));

          trads.forEach(t => {
            if (t.campo === "title") {
              blogTraducido.title = t.valor;
            } else if (t.campo === "description") {
              blogTraducido.description = t.valor;
            }
          });

          return blogTraducido;
        });

        setTranslatedBlogs(blogsFinal);
      } catch (error) {
        console.error("Error cargando traducciones:", error);
        setTranslatedBlogs(blogs);
      }
    };

    loadTranslations();
  }, [blogs, languageCode]);

  const featured = translatedBlogs.find((b) => b.featured);
  const others = translatedBlogs.filter((b) => !b.featured);

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
      className="min-h-screen flex flex-col"
    >
      <main className="max-w-6xl mx-auto px-4 py-8 lg:px-6 flex-1">
        <BottomBarPublic/>
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--text)" }}>
          Blog de Stella Maris 👛
        </h1>
        <p
          className="mb-12"
          style={{ color: "var(--textSecondary)" }}
        >
          Artículos, tutoriales y noticias sobre tecnología
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loading3DIcon />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <span
              className="material-icons-round text-6xl opacity-30"
              style={{ color: "var(--textSecondary)" }}
            >
              article
            </span>
            <h3 className="text-xl font-semibold mt-4" style={{ color: "var(--text)" }}>
              No hay artículos disponibles
            </h3>
          </div>
        ) : (
          <>
            {featured && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Blog destacado</h2>
                <button
                  type="button"
                  onClick={() => {
                    trackBlogClick().catch(console.error);
                    router.push(`/blogs/${featured.id}`);
                  }}
                  className="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition flex flex-col md:flex-row"
                >
                  {featured.blocks?.some((b) => b.type === "image") && (
                    <div className="w-full md:w-1/3 h-48 md:h-auto flex-shrink-0">
                      {featured.blocks
                        .find((b) => b.type === "image")
                        ?.type === "image" && (
                        <img
                          src={
                            featured.blocks.find((b) => b.type === "image")?.type === "image"
                              ? featured.blocks.find((b) => b.type === "image")?.url
                              : ""
                          }
                          alt={
                            featured.blocks.find((b) => b.type === "image")?.type === "image"
                              ? getText(featured.blocks.find((b) => b.type === "image")?.alt, languageCode, featured.blocks.find((b) => b.type === "image")?.alt as string) || getText(featured.title, languageCode, featured.title as string)
                              : ""
                          }
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-center flex-1">
                    <h3 className="text-xl font-bold mb-2">{getText(featured.title, languageCode, featured.title as string)}</h3>
                    {featured.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                        {getText(featured.description, languageCode, featured.description as string)}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-1 text-sm text-#E0A11A dark:text-#f5d890 mt-1 w-fit">
                      <span className="material-icons-round text-base">visibility</span>
                      <span>Leer artículo completo</span>
                    </div>
                  </div>
                </button>
              </section>
            )}

            {others.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Todos los artículos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {others.map((b) => {
                    const imageBlock = b.blocks?.find((block) => block.type === "image");
                    return (
                      <article
                        key={b.id}
                        onClick={() => {
                          trackBlogClick().catch(console.error);
                          router.push(`/blogs/${b.id}`);
                        }}
                        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition"
                      >
                        {imageBlock && imageBlock.type === "image" && (
                          <div className="w-full h-40 overflow-hidden">
                            <img
                              src={imageBlock.url}
                              alt={getText(imageBlock.alt, languageCode, imageBlock.alt as string) || getText(b.title, languageCode, b.title as string)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-lg font-semibold mb-2">{getText(b.title, languageCode, b.title as string)}</h3>
                          {b.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3 flex-1">
                              {getText(b.description, languageCode, b.description as string)}
                            </p>
                          )}
                          <div className="inline-flex items-center gap-1 text-xs text-#E0A11A dark:text-#f5d890 mt-auto">
                            <span className="material-icons-round text-sm">arrow_forward</span>
                            <span>Ver más</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

