// components/ui/FlipCard.jsx
import React from "react";
import { shouldUseBackdropFilter } from "../../lib/browserDetection";

export default function FlipCard({ imageSrc, name, summary, onClick }) {
  const useBackdropFilter = shouldUseBackdropFilter();
  
  // For Firefox, use a more opaque background instead of backdrop-filter
  const frontFaceStyle = {
    background: useBackdropFilter 
      ? "rgba(255, 255, 255, 0.95)" 
      : "rgba(255, 255, 255, 0.98)", // More opaque for Firefox
    backdropFilter: useBackdropFilter ? "blur(40px)" : "none",
    WebkitBackdropFilter: useBackdropFilter ? "blur(40px)" : "none",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5), 0 20px 60px rgba(255, 255, 255, 0.4)",
  };
  
  const backFaceStyle = {
    background: useBackdropFilter 
      ? "rgba(255, 255, 255, 0.95)" 
      : "rgba(255, 255, 255, 0.98)", // More opaque for Firefox
    backdropFilter: useBackdropFilter ? "blur(40px)" : "none",
    WebkitBackdropFilter: useBackdropFilter ? "blur(40px)" : "none",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5), 0 20px 60px rgba(255, 255, 255, 0.4)",
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer w-full h-full [perspective:1000px]"
      style={{
        minHeight: "320px",
      }}
    >
      <div className="flip-card-inner relative w-full h-full [transform-style:preserve-3d]">
        {/* Front Face */}
        <div 
          className="flip-card-front absolute inset-0 backface-hidden rounded-3xl overflow-hidden"
          style={frontFaceStyle}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(119, 37, 131, 0.02) 0%, rgba(156, 30, 150, 0.02) 100%)",
            }}
          />

          {/* Content Container */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            {/* Icon - Clean, no background */}
            <div className="mb-8 transition-transform duration-500 group-hover:scale-110">
              <img
                src={imageSrc}
                alt={name}
                className="h-34 w-34 object-contain"
                style={{
                  filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))",
                }}
              />
            </div>

            {/* Branch Name */}
            <h3 className="text-2xl font-semibold text-gray-900 tracking-tight text-center mb-4 leading-tight">
              {name}
            </h3>

            {/* Accent line */}
            <div 
              className="h-0.5 rounded-full transition-all duration-500 accent-line"
              style={{
                background: "linear-gradient(90deg, #772583 0%, #9C1E96 100%)",
                width: "32px",
              }}
            />

            {/* Shine effect on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                transform: "translateX(-100%)",
                animation: "shimmer 1.5s ease-in-out",
              }}
            />
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="flip-card-back absolute inset-0 backface-hidden rounded-3xl overflow-hidden"
          style={backFaceStyle}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(119, 37, 131, 0.03) 0%, rgba(156, 30, 150, 0.03) 100%)",
            }}
          />

          {/* Content Container */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            {/* Summary */}
            <div className="text-center mb-8">
              <p className="text-base text-gray-700 leading-relaxed font-normal mb-6 px-4">
                {summary}
              </p>
              
              {/* Accent line */}
              <div 
                className="h-0.5 rounded-full mx-auto transition-all duration-500"
                style={{
                  background: "linear-gradient(90deg, #772583 0%, #9C1E96 100%)",
                  width: "32px",
                }}
              />
            </div>

            {/* Call to action */}
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-sm font-medium text-[#772583] group-hover:text-[#9C1E96] transition-colors duration-300">
                Learn more
              </span>
              <svg 
                className="w-4 h-4 text-[#772583] group-hover:text-[#9C1E96] group-hover:translate-x-1 transition-all duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Shine effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                transform: "translateX(-100%)",
                animation: "shimmer 1.5s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) translateY(200%) rotate(45deg);
          }
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-card-inner {
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          transform: rotateY(0deg);
          will-change: transform;
        }
        .group:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front {
          transform: translate3d(0, 0, 0) rotateY(0deg);
        }
        .flip-card-back {
          transform: translate3d(0, 0, 0) rotateY(180deg);
        }
        .group:hover .flip-card-front .accent-line {
          width: 56px;
        }
      `}</style>
    </div>
  );
}
