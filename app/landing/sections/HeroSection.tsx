"use client";

import React from "react";
import type {
  LandingSectionStyles,
  LandingFieldStyle,
  FieldPosition,
} from "../../lib/landing-types";

// ── Hook ────────────────────────────────────────────────────────────────────
// Eliminado hook personalizado para evitar problemas con hooks

// ── Tipos ────────────────────────────────────────────────────────────────────
type HeroItem = {
  title?: string;
  subtitle?: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string | null;
  generalMessage?: string;
  fieldStyles?: Record<string, LandingFieldStyle>;
  fieldPositions?: Record<string, { desktop?: FieldPosition; mobile?: FieldPosition }>;
};

export type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  badge?: string;
  titleMobileFontSize?: string | number;
  subtitleMobileFontSize?: string | number;
  badgeMobileFontSize?: string | number;
  buttonTextMobileFontSize?: string | number;
  generalMessage?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string | null;
  styles?: LandingSectionStyles;
  fieldStyles?: Record<string, LandingFieldStyle>;
  fieldPositions?: Record<string, { desktop?: FieldPosition; mobile?: FieldPosition }>;
  items?: HeroItem[];
  // When provided by an editor/preview, forces rendering for that device
  device?: "desktop" | "mobile";
};

// ── Componente principal ─────────────────────────────────────────────────────
export default function HeroSection({
  title,
  subtitle,
  badge,
  titleMobileFontSize,
  subtitleMobileFontSize,
  badgeMobileFontSize,
  buttonTextMobileFontSize,
  buttonText,
  buttonLink,
  image,
  styles,
  fieldStyles,
  fieldPositions,
  items,
  generalMessage,
  device,
}: HeroSectionProps) {
  
  // ── TODOS los hooks primero ────────────────────────────────────────────────
  const [screenType, setScreenType] = React.useState<"mobile" | "tablet" | "desktop">("desktop");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 768 : true;
  });

  // ── Todos los useEffect ─────────────────────────────────────────────────────
  // Device detection
  React.useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Screen type detection
  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      if (w < 640) setScreenType("mobile");
      else if (w < 1024) setScreenType("tablet");
      else setScreenType("desktop");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Luego el resto de lógica ────────────────────────────────────────────────
  const bg = styles?.backgroundColor;
  const color = styles?.textColor;
  const textAlign: React.CSSProperties["textAlign"] = styles?.textAlign || "center";
  const borderRadius = styles?.borderRadius || "1.5rem";

  // Dimensiones base de la imagen en píxeles
  const BASE_IMAGE_WIDTH = 2400;
  const BASE_IMAGE_HEIGHT = 1000;
  const BASE_ASPECT_RATIO = BASE_IMAGE_WIDTH / BASE_IMAGE_HEIGHT; // 2.4

  // ── Helper para convertir posiciones de píxeles a porcentajes
  // positionsSource: se puede pasar `current.fieldPositions` para priorizar posiciones por item
  const getPositioningStyle = (
    fieldName: string,
    isDesktop: boolean,
    positionsSource?: Record<string, { desktop?: FieldPosition; mobile?: FieldPosition }>
  ): React.CSSProperties => {
    const src = positionsSource || fieldPositions;
    if (!src?.[fieldName]) return {};

    const position = isDesktop ? src[fieldName].desktop : src[fieldName].mobile;
    if (!position) return {};

    // Convertir píxeles a porcentajes relativos a las dimensiones base
    const style = {
      ...(position.left !== undefined && { left: `${(position.left / BASE_IMAGE_WIDTH) * 100}%` }),
      ...(position.top !== undefined && { top: `${(position.top / BASE_IMAGE_HEIGHT) * 100}%` }),
      // Para badge y buttonText dejamos que el contenido determine el tamaño
      ...((fieldName !== "badge" && fieldName !== "buttonText" && position.width !== undefined) && { width: `${(position.width / BASE_IMAGE_WIDTH) * 50}%` }),
      ...((fieldName !== "badge" && fieldName !== "buttonText" && position.height !== undefined) && { height: `${(position.height / BASE_IMAGE_HEIGHT) * 50}%` }),
      ...(position.zIndex !== undefined && { zIndex: position.zIndex }),
    };

    // (no debug logs in production)

    return style;
  };

  const heroItems: HeroItem[] = React.useMemo(() => {
    return (
      items && items.length
        ? items.map((item) => item)
        : [
            {
              title,
              subtitle,
              badge,
              buttonText,
              buttonLink,
              image,
              generalMessage,
            },
          ]
    ).filter((h) => h && (h.title || h.subtitle || h.image));
  }, [items, title, subtitle, badge, buttonText, buttonLink, image, generalMessage]);

  // debug logs removed

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  const goToPrev = React.useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? heroItems.length - 1 : prev - 1
    );
  }, [heroItems.length]);

  // Autoplay
  React.useEffect(() => {
    const intervalId = heroItems.length > 1 ? setInterval(goToNext, 5000) : undefined;
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [heroItems.length, goToNext]);

  // Precargar la siguiente imagen en paralelo para transición suave sin parpadeo
  React.useEffect(() => {
    if (heroItems.length > 1) {
      // Precargar la siguiente imagen
      const nextIndex = (currentIndex + 1) % heroItems.length;
      const nextImage = heroItems[nextIndex]?.image;
      
      if (nextImage) {
        const img = new window.Image();
        img.src = nextImage;
      }
    }
    return () => {};
  }, [currentIndex, heroItems]);

  // ── Current item ───────────────────────────────────────────────────────────
  const current = heroItems.length > 0 ? heroItems[Math.min(currentIndex, heroItems.length - 1)] : null;
  const currentFieldStyles = current?.fieldStyles || {};
  const currentFieldPositions = current?.fieldPositions || fieldPositions || {};

  // debug logs removed

  // Helper para resolver estilos por campo considerando legacy y device-aware shape
  const resolveFieldStyle = (fieldName: string): React.CSSProperties => {
    const top = (fieldStyles as any)?.[fieldName] || {};
    const item = (currentFieldStyles as any)[fieldName] || {};

    const pickFor = (value: any) => {
      if (!value) return {};
      if (value.desktop !== undefined || value.mobile !== undefined) {
        return isDesktop ? value.desktop || {} : value.mobile || {};
      }
      return value;
    };

    const topPicked = pickFor(top);
    const itemPicked = pickFor(item);

    return {
      ...topPicked,
      ...itemPicked,
      ...getPositioningStyle(fieldName, isDesktop, currentFieldPositions),
    } as React.CSSProperties;
  };

  const badgeStyle: React.CSSProperties = resolveFieldStyle("badge");
  const titleStyle: React.CSSProperties = resolveFieldStyle("title");
  const subtitleStyle: React.CSSProperties = resolveFieldStyle("subtitle");
  const buttonTextStyle: React.CSSProperties = resolveFieldStyle("buttonText");

  // Aplicar tamaños de fuente móvil si están definidos (priorizar item > props)
  const getMobileFontSizeFor = (fieldName: string): string | undefined => {
    // Priorizar valor por item (current)
    const itemVal = (current as any)?.[`${fieldName}MobileFontSize`];
    if (itemVal !== undefined && itemVal !== null) return typeof itemVal === "number" ? `${itemVal}px` : String(itemVal);

    // Luego props a nivel de sección (destructurados arriba)
    const topMap: Record<string, any> = {
      title: titleMobileFontSize,
      subtitle: subtitleMobileFontSize,
      badge: badgeMobileFontSize,
      buttonText: buttonTextMobileFontSize,
    };
    const topVal = topMap[fieldName];
    if (topVal !== undefined && topVal !== null) return typeof topVal === "number" ? `${topVal}px` : String(topVal);

    return undefined;
  };

  // Añadir fontSize a estilos si estamos en mobile y existe valor
  if (!isDesktop) {
    const tfs = getMobileFontSizeFor("title");
    if (tfs) titleStyle.fontSize = tfs;
    const sfs = getMobileFontSizeFor("subtitle");
    if (sfs) subtitleStyle.fontSize = sfs;
    const bfs = getMobileFontSizeFor("badge");
    if (bfs) badgeStyle.fontSize = bfs;
    const btnfs = getMobileFontSizeFor("buttonText");
    if (btnfs) buttonTextStyle.fontSize = btnfs;
  }

  // Estilos inline para la variante por defecto (cuando no hay posicionamiento)
  const defaultBadgeInlineStyle: React.CSSProperties = !isDesktop && getMobileFontSizeFor("badge") ? { fontSize: getMobileFontSizeFor("badge") } : {};
  const defaultTitleInlineStyle: React.CSSProperties = !isDesktop && getMobileFontSizeFor("title") ? { fontSize: getMobileFontSizeFor("title") } : {};
  const defaultSubtitleInlineStyle: React.CSSProperties = !isDesktop && getMobileFontSizeFor("subtitle") ? { fontSize: getMobileFontSizeFor("subtitle") } : {};
  const defaultButtonInlineStyle: React.CSSProperties = !isDesktop && getMobileFontSizeFor("buttonText") ? { fontSize: getMobileFontSizeFor("buttonText") } : {};

  

  // Container style: include background image as fallback so hero shows image
  const containerStyle: React.CSSProperties = {
    ...(bg ? { backgroundColor: bg } : {}),
    ...(color ? { color } : {}),
    paddingTop: 0,
    paddingBottom: 0,
    textAlign,
  };

const innerStyle: React.CSSProperties = {
  aspectRatio:
    screenType === "mobile"
      ? "6 / 5"
      : screenType === "tablet"
      ? "11 / 9"
      : "2400 / 1300",
  overflow: "hidden",
};


  return (
    <section style={containerStyle} className="m-0">
      <div
        className="relative overflow-hidden w-full max-w-full min-h-0"
        style={{
          ...innerStyle,
          backgroundImage: current?.image ? `url(${current.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {current?.image && (
          <img
            src={current.image}
            alt={current.title || "Hero"}
            width={1920}
            height={840}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover block"
            style={{display: "block" }}
            draggable={false}
          />
        )}



        {/* Elementos posicionados personalizados (solo si tienen positioning) */}
        {fieldPositions?.badge && current?.badge && (
          <span
            className="absolute inline-block px-2 py-0.5 text-[6px] sm:px-3 sm:py-1 sm:text-xs font-bold tracking-widest uppercase bg-white/90 text-black dark:bg-slate-900/90 dark:text-white rounded-full shadow"
            style={{
              position: "absolute",
              ...badgeStyle,
            }}
          >
            {current.badge}
          </span>
        )}

        {fieldPositions?.title && current?.title && (
          <h2
            className="absolute text-xl sm:text-5xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg"
            style={{
              position: "absolute",
              ...titleStyle,
              maxWidth: "90%",
            }}
          >
            {current.title}
          </h2>
        )}

        {fieldPositions?.subtitle && current?.subtitle && (
          <p
            className="absolute text-white/80 text-[9px] sm:text-sm drop-shadow"
            style={{
              position: "absolute",
              ...subtitleStyle,
              maxWidth: "90%",
            }}
          >
            {current.subtitle}
          </p>
        )}

        {fieldPositions?.buttonText && current?.buttonText && (
          <a
            href={current.buttonLink || "/products-by-category"}
            className="absolute inline-flex items-center gap-1 sm:gap-2 bg-white/95 hover:bg-white text-black font-bold text-[9px] sm:text-2xl px- py-1.5 sm:px-1 sm:py-4 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              position: "absolute",
              ...buttonTextStyle,
            }}
          >
            <span>{current.buttonText}</span>
            <span className="material-icons-round text-xs sm:text-sm">arrow_forward</span>
          </a>
        )}

        {/* Flechas de navegación */}
        {heroItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="material-icons-round text-lg sm:text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="material-icons-round text-lg sm:text-xl">chevron_right</span>
            </button>
          </>
        )}

        {/* Contenido textual por defecto (sin posicionamiento personalizado) */}
        {!fieldPositions?.badge && !fieldPositions?.title && !fieldPositions?.subtitle && (
          <div className="absolute left-0 right-0 bottom-7 z-20 flex flex-col items-start text-left gap-0 sm:gap-0 pb-1 px-2 sm:pb-4 sm:px-8 w-full max-w-full">
            <div className="absolute sm:bottom-50 bottom-15">
                {current?.badge && (
                  <span
                    className="inline-block px-2 py-0.5 text-[6px] sm:px-3 sm:py-1 sm:text-xs font-bold tracking-widest uppercase bg-white/90 text-black dark:bg-slate-900/90 dark:text-white rounded-full shadow"
                    style={{ ...defaultBadgeInlineStyle, ...badgeStyle }}
                  >
                    {current.badge}
                  </span>
                )}
                {current?.title && (
                  <h2
                    className="text-xl sm:text-5xl lg:text-5xl font-extrabold text-white leading-tight max-w-[90vw] sm:max-w-2xl drop-shadow-lg"
                    style={{ ...defaultTitleInlineStyle, ...titleStyle }}
                  >
                    {current.title}
                  </h2>
                )}
                {current?.subtitle && (
                  <p
                    className="text-white/80 text-[9px] sm:text-sm max-w-[90vw] sm:max-w-2xl drop-shadow"
                    style={{ ...defaultSubtitleInlineStyle, ...subtitleStyle }}
                  >
                    {current.subtitle}
                  </p>
                )}
            </div>

            {current?.buttonText && (
              <div className="w-full flex justify-center sm:py-3 pb-5">
                <a
                  href={current.buttonLink || "/products-by-category"}
                  className="inline-flex items-centersm:gap-2 bg-white/95 hover:bg-white text-black font-bold text-[9px] sm:text-2xl px-3 py-1.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  style={{ ...defaultButtonInlineStyle, ...buttonTextStyle }}
                >
                  <span>{current.buttonText}</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Dots indicadores */}
        {heroItems.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-20">
            {heroItems.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}