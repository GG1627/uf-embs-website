import React, { useMemo } from "react";

export default function GradientMesh({
  colors,
  blobs,
  baseGradient = "linear-gradient(to bottom, #ffffff, #f8f8f8, #ffffff)",
  minHeight = "200vh",
  className = "",
  zIndex = -1,
}) {
  // The original 9 blobs (positions/sizes/blur) with your exact defaults
  const defaultBlobs = [
    { className: "absolute top-0 -left-1/4 w-[1000px] h-[1000px] rounded-full blur-3xl",       color: "#772583", opacity: 0.15 },
    { className: "absolute top-1/3 -right-1/4 w-[1200px] h-[1200px] rounded-full blur-3xl",    color: "#00629b", opacity: 0.20 },
    { className: "absolute top-2/3 left-1/4 w-[1000px] h-[1000px] rounded-full blur-3xl",      color: "#00a3e0", opacity: 0.15 },
    { className: "absolute top-1/2 left-1/3 w-[800px] h-[800px] rounded-full blur-3xl",        color: "#009ca6", opacity: 0.18 },
    { className: "absolute top-3/4 right-1/3 w-[900px] h-[900px] rounded-full blur-3xl",       color: "#007377", opacity: 0.20 },
    { className: "absolute top-1/4 right-1/2 w-[700px] h-[700px] rounded-full blur-3xl",       color: "#9b4da8", opacity: 0.12 },
    { className: "absolute bottom-1/4 right-1/4 w-[850px] h-[850px] rounded-full blur-3xl",    color: "#33b8e5", opacity: 0.15 },
    { className: "absolute bottom-1/3 left-1/6 w-[950px] h-[950px] rounded-full blur-3xl",     color: "#a44da0", opacity: 0.17 },
    { className: "absolute top-20 right-10 w-[800px] h-[800px] rounded-full blur-3xl",         color: "#a44da0", opacity: 0.15 },
  ];

  // If caller provides blobs, use them; else use defaults with optional color overrides
  const resolvedBlobs = useMemo(() => {
    if (Array.isArray(blobs) && blobs.length) return blobs;

    if (Array.isArray(colors) && colors.length) {
      // Map provided colors onto the default blob slots, cycling if fewer colors
      return defaultBlobs.map((b, i) => ({
        ...b,
        color: colors[i % colors.length],
      }));
    }
    return defaultBlobs;
  }, [blobs, colors]);

  return (
    <div
      className={`absolute inset-0 w-full ${className}`}
      style={{ zIndex, minHeight }}
      aria-hidden
    >
      {/* Main gradient background (unchanged) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ background: baseGradient }}
      />

      {/* Blob layers */}
      {resolvedBlobs.map((b, idx) => (
        <div
          key={idx}
          className={b.className}
          style={{ backgroundColor: b.color, opacity: String(b.opacity) }}
        />
      ))}
    </div>
  );
}
