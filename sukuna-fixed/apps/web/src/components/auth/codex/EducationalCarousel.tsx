'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=1100&fit=crop&auto=format",
    alt: "Students collaborating in classroom",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&h=1100&fit=crop&auto=format",
    alt: "Student reading and studying",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&h=1100&fit=crop&auto=format",
    alt: "Teacher in front of a classroom",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&h=1100&fit=crop&auto=format",
    alt: "Modern school hallway",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=1100&fit=crop&auto=format",
    alt: "Students learning together",
  },
];

export function EducationalCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#1a1a1a" }}>
      {/* Images — crossfade only, no motion translate to prevent flicker */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Very subtle vignette at bottom for page dots legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)" }}
      />

      {/* Page dots — bottom center */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === current ? "#007AFF" : "rgba(255,255,255,0.45)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
