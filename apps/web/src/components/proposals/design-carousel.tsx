"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type DesignCarouselProps = {
  images: string[];
  title?: string;
  description?: string;
};

export function DesignCarousel({
  images,
  title = "Website Design & Development",
  description =
    "This proposal outlines a strategic branding process designed to clarify your positioning, strengthen your identity, and create a brand that drives long-term growth.",
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
      className="w-[98%] flex flex-col items-center py-12 md:py-16"
    >
      <div className="w-full max-w-[1200px] px-6">
        <h2 className="text-[26px] font-sans font-medium text-zinc-900 mb-2 text-left">
          {title}
        </h2>
        <p className="text-sm text-zinc-600 text-left w-full mb-8">
          {description}
        </p>

        <div className="relative group/carousel">
          {/* Main Carousel Container */}
          <div className="relative w-full overflow-hidden rounded-xl bg-zinc-50 flex items-center justify-center">
            <div className="relative w-full h-[min(55vh,552px)]">
              <div className="absolute inset-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                  src={images[currentIndex]}
                  alt={`Design ${currentIndex + 1}`}
                  fill
                  className="object-contain rounded-xl"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority={currentIndex === 0}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-zinc-900 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white focus:outline-none shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-5 h-5" strokeWidth={2} />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-zinc-900 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white focus:outline-none shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-5 h-5" strokeWidth={2} />
                </button>
              </>
            )}
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
                        ? "w-8 bg-zinc-900"
                        : "w-1.5 bg-zinc-300 group-hover/dot:bg-zinc-500"
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
