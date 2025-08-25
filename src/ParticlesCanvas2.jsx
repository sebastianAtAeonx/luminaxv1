import React, { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesCanvas2 = () => {
  console.log("ParticlesCanvas component rendering...");

  const particlesInit = useCallback(async (engine) => {
    console.log("Starting particles init...");
    try {
      await loadSlim(engine);
      console.log("Particles engine loaded successfully!");
    } catch (error) {
      console.error("Error loading particles engine:", error);
    }
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Particles container loaded:", container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
      }}
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        particles: {
          color: { value: "#FFFFFF" }, // White for visibility
          number: { value: 50 },
          opacity: { value: 1 },
          size: { value: 3 },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: { default: "bounce" },
          },
        },
      }}
    />
  );
};

export default ParticlesCanvas2;
