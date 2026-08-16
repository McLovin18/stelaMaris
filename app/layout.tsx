import "./globals.css";

import Footer from "./components/Footer";
import { cookies } from "next/headers";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";
import LayoutContentClient from "./components/LayoutContentClient";
import { StructuredData } from "./components/StructuredData";
import type { Metadata, Viewport } from "next";
import { Source_Serif_4 } from "next/font/google";

// ISR Global: Revalidar sitio cada 30 minutos
// Optimiza regeneración de página principal y otros contenidos estáticos
export const revalidate = 1800;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stellamaris.straw";
const SITE_NAME = "Stella Maris 👛 by Gabriela Cárdenas";
const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-source-serif-4",
});

export const metadata: Metadata = {
  title: {
    default: "Stella Maris 👛 - Carteras de Paja Coquilla",
    template: "%s | Stella Maris 👛 by Gabriela Cárdenas",
  },
  description:
    "Stella Maris 🌟 Una marca 100% Ecuatoriana 🇪🇨 hecha con Propósito, Estilo y Elegancia. Descubre nuestras hermosas carteras de paja coquilla hechas a mano con amor.",
  keywords: [
    "carteras de paja coquilla",
    "paja coquilla",
    "carteras ecuatorianas",
    "artesanías ecuatorianas",
    "Stella Maris",
    "Gabriela Cárdenas",
    "carteras hechas a mano",
    "moda ecuatoriana",
    "accesorios",
    "paja toquilla",
  ],
  creator: "Stella Maris 👛 by Gabriela Cárdenas",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",

  // Open Graph - Redes Sociales
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Stella Maris 👛 - Carteras de Paja Coquilla",
    description:
      "Stella Maris 🌟 Una marca 100% Ecuatoriana 🇪🇨 hecha con Propósito, Estilo y Elegancia. Descubre nuestras hermosas carteras de paja coquilla hechas a mano con amor.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Stella Maris 👛 - Carteras de Paja Coquilla",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Stella Maris 👛 - Carteras de Paja Coquilla",
    description:
      "Stella Maris 🌟 Una marca 100% Ecuatoriana 🇪🇨 hecha con Propósito, Estilo y Elegancia. Carteras de paja coquilla hechas a mano.",
    images: [`${SITE_URL}/twitter-image.jpg`],
  },

  // Canonícal URL
  alternates: {
    canonical: SITE_URL,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // Verificación
  verification: {
    google: "tu-codigo-google-search-console", // Reemplazar con tu código
  },

  // Apple
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
};

// Viewport export - separate from metadata in Next.js 16
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={sourceSerif4.variable}>
      <head>
        {/* Google Analytics gtag.js - insertado justo después de <head> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-K1Q0MYDSKF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K1Q0MYDSKF');
            `,
          }}
        />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
        
        <StructuredData />
      </head>
      <body className="relative">
        <ToastProvider>
          <OnboardingProvider>
            <LanguageProvider>
              <LayoutContentClient>{children}</LayoutContentClient>
            </LanguageProvider>
          </OnboardingProvider>
        </ToastProvider>
      </body>
    </html>
  );
}