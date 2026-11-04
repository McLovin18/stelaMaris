"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type {
  LandingSectionStyles,
  LandingFieldStyle,
} from "../../lib/landing-types";

export type GallerySectionProps = {
  title?: string;
  images?: string[];
  items?: { title?: string; image?: string }[];
  styles?: LandingSectionStyles;
  fieldStyles?: Record<string, LandingFieldStyle>;
};

const AUTOPLAY_MOBILE = 5000; // 5s en móvil
const AUTOPLAY_DESKTOP = 3500;
const VIEWPORT_PAD = 12; // px de aire vertical para sombras / hover
const MAX_DOTS = 8;

// Cuántas columnas mostrar según breakpoint
function getColumns(width: number, total: number): number {
  let c = 4;
  if (width < 640) c = 1; // móvil: un solo card
  else if (width < 1024) c = 2;
  else if (width < 1280) c = 3;
  return Math.max(1, Math.min(c, total));
}

export default function GallerySection({
  title,
  images = [],
  items,
  styles,
  fieldStyles,
}: GallerySectionProps) {
  const galleryItems = (
    items && items.length
      ? items
      : images.map((src) => ({ title: "", image: src }))
  ) as { title?: string; image?: string }[];

  const total = galleryItems.length;

  // ── State ──
  const [index, setIndex] = useState(0);
  const [cols, setCols] = useState(1);
  const [ready, setReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imgH, setImgH] = useState(0);

  const imgRef = useRef<HTMLDivElement | null>(null);
  const touchRef = useRef<{ x: number; y: number; horizontal: boolean | null } | null>(null);

  // ── Columnas responsivas ──
  useEffect(() => {
    const update = () => {
      setCols(getColumns(window.innerWidth, total));
      setReady(true);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [total]);

  const effectiveCols = Math.max(1, Math.min(cols, total));
  const isMobile = effectiveCols === 1;
  const needsCarousel = total > effectiveCols;
  const maxIndex = Math.max(0, total - effectiveCols);
  const pages = maxIndex + 1;
  const safeIndex = Math.min(index, maxIndex);
  const interval = isMobile ? AUTOPLAY_MOBILE : AUTOPLAY_DESKTOP;

  // ── Medir alto de la imagen para centrar las flechas ──
  useEffect(() => {
    const el = imgRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setImgH(el.offsetHeight));
    ro.observe(el);
    setImgH(el.offsetHeight);
    return () => ro.disconnect();
  }, [ready, effectiveCols, total]);

  // ── Navegación (circular) ──
  const navigate = useCallback(
    (dir: "left" | "right") => {
      if (!needsCarousel) return;
      setIndex((prev) => {
        const p = Math.min(prev, maxIndex);
        if (dir === "right") return p >= maxIndex ? 0 : p + 1;
        return p <= 0 ? maxIndex : p - 1;
      });
    },
    [needsCarousel, maxIndex]
  );

  // ── Autoplay (se reinicia con cada cambio de slide) ──
  useEffect(() => {
    if (!needsCarousel || isPaused || isDragging) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setTimeout(() => navigate("right"), interval);
    return () => clearTimeout(id);
  }, [needsCarousel, isPaused, isDragging, interval, safeIndex, navigate]);

  // ── Swipe táctil ──
  const onTouchStart = (e: React.TouchEvent) => {
    if (!needsCarousel) return;
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, horizontal: null };
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const s = touchRef.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (s.horizontal === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      s.horizontal = Math.abs(dx) > Math.abs(dy);
    }
    if (s.horizontal) {
      setIsDragging(true);
      setDragX(dx);
    }
  };

  const onTouchEnd = () => {
    const s = touchRef.current;
    touchRef.current = null;
    if (s?.horizontal) {
      if (dragX < -50) navigate("right");
      else if (dragX > 50) navigate("left");
    }
    setIsDragging(false);
    setDragX(0);
    setIsPaused(false);
  };

  if (!total) return null;

  const gap = isMobile ? 0 : effectiveCols >= 3 ? 24 : 20;
  const slidePct = 100 / effectiveCols;
  const arrowTop = VIEWPORT_PAD + imgH / 2;
  const itemTitleStyle = fieldStyles?.itemTitle;

  const sectionStyle: React.CSSProperties = {};
  if (styles?.paddingTop) sectionStyle.paddingTop = styles.paddingTop;
  if (styles?.paddingBottom) sectionStyle.paddingBottom = styles.paddingBottom;

  const arrowBase =
    "absolute z-20 -translate-y-1/2 rounded-full flex items-center justify-center " +
    "h-9 w-9 sm:h-11 sm:w-11 border shadow-lg backdrop-blur-md " +
    "transition-all duration-200 hover:scale-110 active:scale-90 focus:outline-none " +
    "focus-visible:ring-2";

  const arrowStyle: React.CSSProperties = {
    top: arrowTop,
    background: "color-mix(in srgb, var(--card, #fff) 82%, transparent)",
    borderColor: "var(--border, #CEC1A8)",
    color: "var(--text, #584738)",
  };

  return (
    <section
      style={sectionStyle}
      className="w-full max-w-full overflow-hidden flex flex-col items-center m-0 py-6 md:py-12"
    >
      {/* ── Título ── */}
      {title && (
        <div className="mb-4 md:mb-6 px-4 text-center">
          <h2
            className="section-title"
            style={fieldStyles?.title || { color: "var(--text)" }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* ── Contenedor principal ── */}
      <div
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-14"
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Flecha izquierda */}
        {needsCarousel && (
          <button
            type="button"
            onClick={() => navigate("left")}
            aria-label="Anterior"
            className={`${arrowBase} left-6 sm:left-1 lg:left-2`}
            style={arrowStyle}
          >
            <span className="material-icons-round" style={{ fontSize: 22 }}>
              chevron_left
            </span>
          </button>
        )}

        {/* Flecha derecha */}
        {needsCarousel && (
          <button
            type="button"
            onClick={() => navigate("right")}
            aria-label="Siguiente"
            className={`${arrowBase} right-6 sm:right-1 lg:right-2`}
            style={arrowStyle}
          >
            <span className="material-icons-round" style={{ fontSize: 22 }}>
              chevron_right
            </span>
          </button>
        )}

        {/* ── Viewport del carrusel ── */}
        <div
          className="w-full overflow-hidden"
          style={{
            paddingTop: VIEWPORT_PAD,
            paddingBottom: VIEWPORT_PAD,
            touchAction: "pan-y",
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div
            className="flex w-full"
            style={{
              transform: `translateX(calc(-${safeIndex * slidePct}% + ${dragX}px))`,
              transition: isDragging
                ? "none"
                : "transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)",
              willChange: "transform",
            }}
          >
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="min-w-0"
                style={{
                  flex: `0 0 ${slidePct}%`,
                  paddingLeft: gap / 2,
                  paddingRight: gap / 2,
                }}
              >
                <GalleryCard
                  item={item}
                  titleStyle={itemTitleStyle}
                  imgRef={idx === 0 ? imgRef : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Indicadores ── */}
        {needsCarousel && pages > 1 && (
          <div className="flex justify-center items-center mt-4 md:mt-6">
            {pages <= MAX_DOTS ? (
              <div className="flex items-center gap-2">
                {Array.from({ length: pages }).map((_, i) => {
                  const active = i === safeIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Ir a slide ${i + 1}`}
                      aria-current={active}
                      onClick={() => setIndex(i)}
                      className="relative rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        width: active ? 32 : 8,
                        height: 8,
                        background: "var(--border, #CEC1A8)",
                      }}
                    >
                      {active && (
                        <span
                          key={`${safeIndex}-${interval}`}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            background: "var(--accent, #AAA396)",
                            width: "100%",
                            transformOrigin: "left",
                            animation: `galleryProgress ${interval}ms linear forwards`,
                            animationPlayState: isPaused ? "paused" : "running",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Muchos slides: contador + barra de progreso
              <div className="flex items-center gap-3 w-full max-w-[220px]">
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: "var(--text, #584738)" }}
                >
                  {safeIndex + 1} / {pages}
                </span>
                <div
                  className="relative flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--border, #CEC1A8)" }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${((safeIndex + 1) / pages) * 100}%`,
                      background: "var(--accent, #AAA396)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes galleryProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="galleryProgress"] { animation: none !important; transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}

// ────────────────────────────────────────────────
// Card individual
// ────────────────────────────────────────────────
function GalleryCard({
  item,
  titleStyle,
  imgRef,
}: {
  item: { title?: string; image?: string };
  titleStyle?: React.CSSProperties;
  imgRef?: React.Ref<HTMLDivElement>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center cursor-pointer w-full max-w-full sm:max-w-[550px] mx-auto select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen */}
      <div
        ref={imgRef}
        className="w-full relative overflow-hidden rounded-2xl border transition-all duration-300"
        style={{
          aspectRatio: "1 / 1",
          background: "var(--card)",
          borderColor: hovered ? "var(--accent, #AAA396)" : "var(--border, #CEC1A8)",
          boxShadow: hovered
            ? "0 8px 32px 0 rgba(88,71,56,0.18)"
            : "0 1px 4px 0 rgba(88,71,56,0.08)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title || "Imagen"}
            draggable={false}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="material-icons-round"
              style={{ fontSize: 40, color: "var(--border, #CEC1A8)" }}
            >
              image
            </span>
          </div>
        )}

        {/* Brillo en hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background:
              "linear-gradient(135deg, rgba(241,234,218,0.18) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Título del item */}
      {item.title && (
        <p
          className="mt-3 text-center text-sm sm:text-sm font-semibold leading-tight transition-colors duration-200 px-2"
          style={{
            ...(titleStyle || {}),
            color: hovered
              ? "var(--accent, #AAA396)"
              : titleStyle?.color || "var(--text, #584738)",
          }}
        >
          {item.title}
        </p>
      )}
    </div>
  );
}