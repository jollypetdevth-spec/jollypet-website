"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  url: string;
  is_primary: boolean;
  sort_order: number;
  alt_text: string | null;
}

interface Props {
  images: GalleryImage[];
  productName: string;
  fallbackEmoji: string;
  fallbackBg: string;
}

export default function ProductImageGallery({ images, productName, fallbackEmoji, fallbackBg }: Props) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const [active, setActive] = useState(sorted[0] ?? null);

  if (!active) {
    return (
      <div className={`${fallbackBg} rounded-2xl aspect-square flex items-center justify-center text-8xl`}>
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
        <Image
          src={active.url}
          alt={active.alt_text ?? productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(img)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                active.url === img.url
                  ? "border-jolly-navy"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img.url}
                alt={`thumb-${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
