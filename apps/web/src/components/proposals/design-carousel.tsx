"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type DesignCarouselProps = {
  images: string[];
  title?: string;
  description?: string;
};

export function DesignCarousel({
  images,
  title = "Design Showcase",
  description = "Explore our design work and visual direction.",
}: DesignCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      id="designs"
      className="w-[98%] bg-[#0C0C0E] rounded-2xl flex flex-col items-center py-12 md:py-16"
    >
      <div className="w-full max-w-[1200px] px-6">
        <h2 className="text-xl md:text-2xl font-medium leading-tight tracking-tight text-zinc-100 mb-3 text-center">
          {title}
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-[650px] mx-auto text-center">
          {description}
        </p>

        <div className="relative group/carousel">
          {/* Main Carousel Container */}
          <div className="relative w-full overflow-hidden rounded-xl bg-[#0E0E10]">
            <div className="aspect-[16/10] relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`Design ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority={currentIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center text-zinc-100 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-zinc-900 focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-5 h-5" strokeWidth={2} />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center text-zinc-100 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-zinc-900 focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-5 h-5" strokeWidth={2} />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-sm rounded-full">
              <span className="text-[11px] font-medium text-zinc-300 tabular-nums">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Indicators */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group/dot focus:outline-none"
                  aria-label={`Go to image ${index + 1}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-zinc-100"
                        : "w-1.5 bg-zinc-600 group-hover/dot:bg-zinc-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
