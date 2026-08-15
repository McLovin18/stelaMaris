"use client";
 
import React from "react";
 
export function Loading3DIcon() {
  return (
    <div className="flex flex-col items-center justify-center py-10 select-none">
 
      {/* CONTENEDOR */}
      <div className="relative w-36 h-36 flex items-center justify-center">
 
        {/* Glow principal */}
        <div className="
          absolute inset-0
          bg-[var(--primary)]/15
          blur-3xl
          rounded-full
          animate-pulse
        " />
 
        {/* Ring exterior */}
        <div className="
          absolute inset-2
          rounded-full
          border border-[var(--border)]
        " />
 
        {/* Ring animado */}
        <div className="
          absolute inset-0
          rounded-full
          border-2 border-transparent
          border-t-[var(--primary)]
          animate-spin
        "
        style={{
          animationDuration: "2.5s"
        }}
        />
 
        {/* Núcleo */}
        <div className="
          relative w-24 h-24
          rounded-full
          bg-[var(--primary)]
          shadow-[0_0_40px_rgba(88,71,56,0.35)]
          flex items-center justify-center
        ">
 
          {/* Ícono: cartera */}
          <div className="relative w-12 h-12 animate-pulse flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* cuerpo de la cartera */}
              <path d="M20 7h-3a4 4 0 0 0-8 0H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              {/* asa de la cartera */}
              <path d="M12 12v4" />
              <path d="M10 14h4" />
              {/* detalle de textura */}
              <path d="M6 7h4" />
              <path d="M14 7h4" />
            </svg>
          </div>
        </div>
      </div>
 
      {/* Texto */}
      <div className="mt-6 flex flex-col items-center">
 
        <span className="
          text-[11px]
          font-bold
          tracking-[0.35em]
          uppercase
          text-[#9E2254]
        ">
          Stella Maris 👛
        </span>
 
 
        <div className="flex gap-1.5 mt-3 items-center">
 
          <div className="flex gap-1.5 animate-loadingSteps">
 
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
 
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
 
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
 
          </div>
        </div>
      </div>
    </div>
  );
}