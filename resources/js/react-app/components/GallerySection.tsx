import React, { useState } from 'react';
import { Camera, X, Maximize2 } from 'lucide-react';
import { defaultGallery, GalleryItem } from '../data/defaultData';

export interface GallerySectionProps {
  galleryItems?: Array<{
    title: string;
    description: string;
    category: string;
    image?: string;
  }>;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<any>(null);

  const items = galleryItems.length > 0 ? galleryItems : defaultGallery;
  const categories = ['All', ...new Set(items.map((item) => item.category || 'Infrastructure'))];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => (item.category || 'Infrastructure') === selectedCategory);

  return (
    <section id="gallery" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm mb-4">
            <Camera className="w-3.5 h-3.5 text-zinc-300" />
            <span>Operational Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans mb-3">
            Our Physical Infrastructure.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            High-density optical racks, core routing engines, and certified fiber splicing field equipment.
          </p>

          {/* Category Filter Pills */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 bg-zinc-900/60 p-1.5 rounded-xl border border-white/10 backdrop-blur-md mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden saas-card cursor-pointer border border-white/10 aspect-[4/3] flex items-end saas-card-hover"
            >
              <img
                src={item.image || item.photo || '/images/gallery/rack.jpg'}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-0"
                onError={(e: any) => {
                  e.target.src = '/images/gallery/rack.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <div className="relative z-10 p-5 w-full flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                    {item.category || 'Infrastructure'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 font-sans">
                    {item.title}
                  </h3>
                </div>

                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden saas-card border border-white/10 shadow-2xl">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition-colors"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-black">
              <img
                src={activeImage.image || activeImage.photo || '/images/gallery/rack.jpg'}
                alt={activeImage.title}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = '/images/gallery/rack.jpg';
                }}
              />
            </div>
            <div className="p-6 bg-zinc-950">
              <h3 className="text-xl font-bold text-white font-sans">{activeImage.title}</h3>
              <p className="text-xs text-zinc-400 mt-1 font-sans">{activeImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
