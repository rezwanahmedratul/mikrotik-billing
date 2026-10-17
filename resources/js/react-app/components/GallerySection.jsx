import React, { useState } from 'react';
import { Camera, X, Maximize2, Layers } from 'lucide-react';
import { defaultGallery } from '../data/defaultData';

export default function GallerySection({ galleryItems = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const items = galleryItems.length > 0 ? galleryItems : defaultGallery;

  const categories = ['All', ...new Set(items.map(item => item.category || 'Infrastructure'))];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => (item.category || 'Infrastructure') === selectedCategory);

  return (
    <section id="gallery" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Operational Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our Physical Infrastructure.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            High-density optical racks, core routing engines, and certified fiber splicing field equipment.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-zinc-950 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/10 aspect-[4/3] flex items-end"
            >
              <img
                src={item.image || item.photo}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-0"
                onError={(e) => {
                  e.target.src = '/images/gallery/rack.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <div className="relative z-10 p-5 w-full flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    {item.category || "Infrastructure"}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
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
          <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden glass-panel-elevated border border-white/10">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-black">
              <img
                src={activeImage.image || activeImage.photo}
                alt={activeImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-zinc-950 border-t border-white/10">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                {activeImage.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {activeImage.title}
              </h3>
              {activeImage.description && (
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {activeImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
