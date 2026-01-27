import { memo, useState } from "react";

const ImageStack = memo(({ image, description, width, height, priority = "auto", loading = "lazy" }) => {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Default dimensions if not provided
  const imageWidth = width || "280px";
  const imageHeight = height || "auto";
  
  const handleError = () => {
    if (retryCount < 2) {
      // Retry loading the image after a short delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false);
      }, 1000 * (retryCount + 1));
    } else {
      setImageError(true);
    }
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Polaroid Container - Small padding around image */}
      <div className="relative bg-white shadow-2xl transform transition-transform duration-300 ease-out inline-block pt-4 pr-4 pl-4 pb-6">
        {/* Image Container with Polaroid Filter Effect */}
        <div className="relative">
          {!imageError ? (
            <>
              <img
                key={retryCount} // Force re-render on retry
                src={image}
                alt={description}
                className="object-contain block border-2 border-gray-300"
                style={{
                  width: imageWidth,
                  height: imageHeight,
                  filter: "sepia(25%) contrast(1.1) brightness(1.1) saturate(0.9) hue-rotate(0deg)",
                }}
                fetchPriority={priority}
                loading={loading}
                decoding="async"
                onError={handleError}
                onLoad={() => setImageError(false)}
              />
              {/* Warm overlay for authentic polaroid look */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-multiply"
                style={{
                  background: "linear-gradient(135deg, rgba(255,220,177,0.15) 0%, rgba(255,200,150,0.1) 50%, rgba(200,180,160,0.2) 100%)",
                  width: imageWidth,
                  height: imageHeight,
                }}
              />
              {/* Strong vignette overlay for nostalgic effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
                  width: imageWidth,
                  height: imageHeight,
                }}
              />
              {/* Grain texture for authentic film look */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  width: imageWidth,
                  height: imageHeight,
                  mixBlendMode: "overlay",
                }}
              />
            </>
          ) : (
            <div 
              className="object-contain border-2 border-gray-300 bg-gray-200 flex items-center justify-center"
              style={{
                width: imageWidth,
                height: imageHeight,
              }}
            >
              <span className="text-gray-500 text-sm">Failed to load</span>
            </div>
          )}
        </div>
        {/* Description text below image */}
        {description && (
          <p 
            className="text-center mt-3 text-gray-800 text-lg px-2 italic"
            style={{
              fontFamily: "'Caveat', 'Kalam', 'Comic Sans MS', sans-serif",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
});

ImageStack.displayName = "ImageStack";

export default ImageStack;
