import { memo } from "react";

const ImageStack = memo(({ image, description, width, height }) => {
  // Default dimensions if not provided
  const imageWidth = width || "280px";
  const imageHeight = height || "auto";
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Polaroid Container - Small padding around image */}
      <div className="relative bg-white shadow-2xl transform transition-transform duration-300 ease-out inline-block pt-4 pr-4 pl-4 pb-10">
        {/* Image Container - No cropping, shows full image */}
        <img
          src={image}
          alt={description}
          className="object-contain block border-2 border-gray-300"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
});

ImageStack.displayName = "ImageStack";

export default ImageStack;
