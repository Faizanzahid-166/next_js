"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images = [], autoPlay = false }) {
  const imgs = Array.isArray(images) && images.length ? images : [images || "/placeholder.png"];
  const [index, setIndex] = useState(0);
  const [autoZoom, setAutoZoom] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    if (autoPlay) {
      autoplayRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % imgs.length);
      }, 4000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [autoPlay, imgs.length]);

  useEffect(() => {
    if (autoZoom) {
      const t = setInterval(() => setIsZoomed((z) => !z), 2500);
      return () => clearInterval(t);
    } else {
      setIsZoomed(false);
    }
  }, [autoZoom]);

  return (
    <div>
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-white border border-neutral-200">
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out ${isZoomed ? "scale-110" : "scale-100"}`}
          style={{ transformOrigin: "center center" }}
        >
          <Image src={imgs[index]} alt={`Product image ${index + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
        {/* Left/Right arrows */}
        <button
          aria-label="Previous image"
          onClick={() => setIndex((i) => (i - 1 + imgs.length) % imgs.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          onClick={() => setIndex((i) => (i + 1) % imgs.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
        >
          ›
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2 overflow-x-auto">
          {imgs.map((src, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`w-20 h-20 rounded-md overflow-hidden border ${i===index? 'border-black':'border-neutral-200'}`}>
              <div className="relative w-full h-full">
                <Image src={src} alt={`thumb-${i}`} fill sizes="80px" className="object-cover" />
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-neutral-600">Auto Zoom</label>
          <input type="checkbox" checked={autoZoom} onChange={(e) => setAutoZoom(e.target.checked)} className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
