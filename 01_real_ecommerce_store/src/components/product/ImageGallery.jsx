"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Pause } from "lucide-react";
import { getProductImages } from "@/lib/productImages";

export default function ImageGallery({ images = [], autoPlay: defaultAutoPlay = false }) {
  const imgs = getProductImages({ images });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(defaultAutoPlay);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const thumbnailRefs = useRef([]);

  // Ensure index stays in bounds if images change
  useEffect(() => {
    if (currentIndex >= imgs.length) {
      setCurrentIndex(0);
    }
  }, [imgs.length, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imgs.length);
  }, [imgs.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  }, [imgs.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Autoplay interval
  useEffect(() => {
    if (!isPlaying || imgs.length <= 1) return;
    const interval = setInterval(handleNext, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, imgs.length, handleNext]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* MAIN FEATURED IMAGE SLIDER CARD */}
      <div
        className="relative w-full aspect-[4/3] max-h-[500px] rounded-2xl overflow-hidden bg-neutral-900/5 border border-border/40 group transition-all duration-300 shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image */}
        <div className="relative w-full h-full cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
          <Image
            src={imgs[currentIndex] || "/placeholder.png"}
            alt={`Product view ${currentIndex + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        {/* Counter Badge */}
        {imgs.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
            {currentIndex + 1} / {imgs.length}
          </div>
        )}

        {/* Action Controls Overlay (Fullscreen & Autoplay) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {imgs.length > 1 && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-full transition-all hover:scale-105"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Open fullscreen image modal"
            className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-full transition-all hover:scale-105"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Previous Button */}
        {imgs.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-900 p-2.5 rounded-full shadow-lg border border-border/50 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Button */}
        {imgs.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-900 p-2.5 rounded-full shadow-lg border border-border/50 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Bottom Dot Indicators on Mobile */}
        {imgs.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-10 sm:hidden">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-neutral-400/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* THUMBNAILS CAROUSEL */}
      {imgs.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-300">
          {imgs.map((src, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={i}
                ref={(el) => (thumbnailRefs.current[i] = el)}
                onClick={() => {
                  setCurrentIndex(i);
                  setIsPlaying(false);
                }}
                className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white ${
                  isActive
                    ? "border-primary ring-2 ring-primary/20 scale-105 shadow-sm"
                    : "border-border/60 hover:border-neutral-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover p-1 rounded-lg"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            <Image
              src={imgs[currentIndex]}
              alt={`Fullscreen image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {imgs.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous fullscreen image"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next fullscreen image"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Lightbox thumbnail bar */}
          {imgs.length > 1 && (
            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 px-4 overflow-x-auto">
              {imgs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all relative ${
                    i === currentIndex ? "border-white scale-110" : "border-white/30 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt={`Thumb ${i}`} fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
