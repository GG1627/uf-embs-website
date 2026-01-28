import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState, useMemo } from "react";
import { getOptimizedParticleCount } from "../../lib/browserDetection";

export default function ParticlesBg({
  id = "particles",
  particleCount = 220,
} = {}) {
  const [init, setInit] = useState(false);
  
  // Optimize particle count based on browser and device performance
  const optimizedParticleCount = useMemo(() => {
    return getOptimizedParticleCount(particleCount);
  }, [particleCount]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id={id}
      className="absolute inset-0 z-10 pointer-events-none"
      options={{
        fpsLimit: 60,
        detectRetina: true,
        background: { color: "transparent" },
        particles: {
          number: {
            value: optimizedParticleCount,
            density: { enable: true, area: 800 },
          },
          size: { value: { min: 1, max: 4 } },
          opacity: { value: 0.6 },
          color: {
            value: ["#96529a", "#007dae", "#772583", "#00629b"],
          },
          move: { enable: true, speed: 1.2, outModes: { default: "out" } },
          shape: { type: "circle" },
          links: { enable: false }, // no connecting lines
        },
        interactivity: {
          events: { onHover: { enable: false } },
        },
      }}
    />
  );
}
