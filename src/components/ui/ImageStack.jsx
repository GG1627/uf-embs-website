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
                  // Filters removed for maximum performance
                }}
                fetchPriority={priority}
                loading={loading}
                decoding="async"
                onError={handleError}
                onLoad={() => setImageError(false)}
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
