import { memo } from "react";
import { careerFields } from "../../data/careerFields";

// Optimized Gallery Item component - memoized for performance
const GalleryItem = memo(({ field, index, onFieldSelect }) => {
  return (
    <div
      className="flex-shrink-0 mx-2 relative group cursor-pointer"
      style={{ width: "200px", height: "300px" }}
      onClick={() => onFieldSelect && onFieldSelect(index)}
    >
      {/* Image container */}
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
        {/* Image with lazy loading - using img tag instead of background for better performance */}
        <img
          src={field.image}
          alt={field.name}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 will-change-transform"
          loading="lazy"
          decoding="async"
        />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/60 transition-all duration-300 pointer-events-none"></div>

        {/* Content overlay - hidden by default, shown on hover */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 tracking-tight">
              {field.name}
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
              {field.description}
            </p>
          </div>
        </div>

        {/* Hover effect border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/50 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
});

GalleryItem.displayName = "GalleryItem";

// Optimized SlidingGallery - uses CSS animation instead of setInterval
const SlidingGallery = memo(({ onFieldSelect }) => {
  // Calculate width for seamless loop (2 sets of images)
  const itemWidth = 200; // width of each item
  const gap = 16; // mx-2 = 8px on each side = 16px total
  const itemTotalWidth = itemWidth + gap;
  const totalWidth = careerFields.length * itemTotalWidth;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Images container with CSS animation - much more performant than setInterval */}
      <div
        className="flex h-full items-center will-change-transform"
        style={{
          width: `${totalWidth * 2}px`, // Double width for seamless loop
          animation: `slide-gallery-${careerFields.length} 60s linear infinite`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {/* Render only 2 sets for seamless loop */}
        {[0, 1].map((setIndex) => (
          <div key={setIndex} className="flex h-full items-center">
            {careerFields.map((field, index) => (
              <GalleryItem
                key={`${field.name}-${setIndex}-${index}`}
                field={field}
                index={index}
                onFieldSelect={onFieldSelect}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Dynamic CSS Animation - inline style tag for dynamic values */}
      <style>{`
        @keyframes slide-gallery-${careerFields.length} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalWidth}px);
          }
        }
      `}</style>
    </div>
  );
});

SlidingGallery.displayName = "SlidingGallery";

export default SlidingGallery;
