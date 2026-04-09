import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadEmojiShape } from "@tsparticles/shape-emoji";
import { useEffect, useState, useMemo } from "react";
import { getOptimizedParticleCount } from "../../lib/browserDetection";

export default function ParticlesBg({
  id = "particles",
  particleCount = 120,
} = {}) {
  const [init, setInit] = useState(false);
  
  const optimizedParticleCount = useMemo(() => {
    return getOptimizedParticleCount(particleCount);
  }, [particleCount]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadEmojiShape(engine);
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
            density: { enable: true, area: 900 },
          },
          size: { value: { min: 10, max: 18 } },
          opacity: {
            value: { min: 0.25, max: 0.55 },
            animation: { enable: true, speed: 0.35, minimumValue: 0.2, sync: false },
          },
          move: {
            enable: true,
            speed: 1.1,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 4, sync: false },
          },
          shape: {
            type: "emoji",
            options: {
              emoji: {
                value: ["🧬"],
              },
            },
          },
          links: { enable: false },
        },
        interactivity: {
          events: { onHover: { enable: false } },
        },
      }}
    />
  );
}
