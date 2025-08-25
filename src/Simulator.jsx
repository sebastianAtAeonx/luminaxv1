import { useCallback, useEffect, useRef, useState, useMemo } from "react";

export const SwarmSimulator = () => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const [droneCount, setDroneCount] = useState(200);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [currentShape, setCurrentShape] = useState("X");
  const dronesRef = useRef([]);
  const targetsRef = useRef([]);
  const lastTimeRef = useRef(0);

  // Memoized random function
  const rand = useCallback((a, b) => Math.random() * (b - a) + a, []);

  // Memoized shape generators with optimized calculations
  const shapes = useMemo(
    () => ({
      X: (W, H) => {
        const pts = [];
        const m = Math.min(W, H) * 0.3;
        const cx = W * 0.5,
          cy = H * 0.5;
        const step = 0.02; // Increased step for better distribution

        // First diagonal line (top-left to bottom-right)
        for (let t = -1; t <= 1; t += step) {
          pts.push({ x: cx + m * t, y: cy + m * t });
        }

        // Second diagonal line (top-right to bottom-left)
        for (let t = -1; t <= 1; t += step) {
          pts.push({ x: cx + m * t, y: cy - m * t });
        }

        return jitter(pts, 3);
      },
      Heart: (W, H) => {
        const pts = [];
        const scale = Math.min(W, H) * 0.008; // Adjusted scale
        const cx = W * 0.5,
          cy = H * 0.5 + 20; // Centered better
        const step = 0.05; // Better step size for cleaner heart

        for (let t = 0; t < Math.PI * 2; t += step) {
          const sinT = Math.sin(t);
          const cosT = Math.cos(t);
          // Parametric heart equation
          const x = 16 * sinT * sinT * sinT;
          const y =
            13 * cosT -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);
          pts.push({
            x: cx + x * scale,
            y: cy - y * scale, // Negative to flip vertically
          });
        }

        return jitter(densify(pts, 1.5), 2);
      },
      Circle: (W, H) => {
        const pts = [];
        const r = Math.min(W, H) * 0.3;
        const cx = W * 0.5,
          cy = H * 0.5;
        const numPoints = 180; // Fixed number instead of calculating
        const step = (Math.PI * 2) / numPoints;
        for (let i = 0; i < numPoints; i++) {
          const a = i * step;
          pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
        }
        return jitter(pts, 1.5);
      },
      Wave: (W, H) => {
        const pts = [];
        const rows = 6,
          cols = 40;
        const w = W * 0.8,
          h = Math.min(H * 0.6, 320);
        const sx = (W - w) * 0.5,
          sy = (H - h) * 0.5;
        const colStep = w / (cols - 1);
        const rowStep = h / (rows - 1);
        for (let r = 0; r < rows; r++) {
          const yBase = sy + r * rowStep;
          for (let c = 0; c < cols; c++) {
            const x = sx + c * colStep;
            const y = yBase + Math.sin((c / cols) * Math.PI * 2 + r * 0.6) * 15;
            pts.push({ x, y });
          }
        }
        return jitter(pts, 1);
      },
      LuminaX: (W, H) => {
        const pts = [];
        const cx = W * 0.5,
          cy = H * 0.5;

        // Vertical line
        for (let i = 0; i < 20; i++) {
          pts.push({ x: cx - 120, y: cy - 40 + i * 4 });
        }
        // Horizontal line
        for (let i = 0; i < 15; i++) {
          pts.push({ x: cx - 120 + i * 3, y: cy + 40 });
        }
        // X pattern
        for (let t = -1; t <= 1; t += 0.08) {
          // Reduced step
          const offset = t * 30;
          const yOffset = t * 40;
          pts.push({ x: cx + 50 + offset, y: cy + yOffset });
          pts.push({ x: cx + 50 + offset, y: cy - yOffset });
        }
        return jitter(pts, 2);
      },
    }),
    []
  );

  const densify = useCallback((pts, mult) => {
    const result = [];
    const len = pts.length;
    const k = Math.max(1, Math.floor(mult));
    const divisor = k + 1;

    for (let i = 0; i < len; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % len];
      result.push(a);

      const dx = (b.x - a.x) / divisor;
      const dy = (b.y - a.y) / divisor;

      for (let j = 1; j <= k; j++) {
        result.push({
          x: a.x + dx * j,
          y: a.y + dy * j,
        });
      }
    }
    return result;
  }, []);

  const jitter = useCallback(
    (pts, amt) => {
      return pts.map((p) => ({
        x: p.x + rand(-amt, amt),
        y: p.y + rand(-amt, amt),
      }));
    },
    [rand]
  );

  // Optimized drone initialization with object pooling concept
  const initDrones = useCallback(
    (W, H) => {
      const drones = dronesRef.current;
      const newLength = droneCount;

      // Reuse existing drone objects when possible
      for (let i = 0; i < newLength; i++) {
        if (drones[i]) {
          drones[i].x = rand(0, W);
          drones[i].y = rand(0, H);
          drones[i].vx = 0;
          drones[i].vy = 0;
        } else {
          drones[i] = {
            x: rand(0, W),
            y: rand(0, H),
            vx: 0,
            vy: 0,
          };
        }
      }

      // Trim excess drones
      drones.length = newLength;
      setTargets(W, H, currentShape);
    },
    [droneCount, currentShape, rand, shapes]
  );

  const setTargets = useCallback(
    (W, H, shape) => {
      const pts = shapes[shape](W, H);
      const targets = targetsRef.current;
      const ptsLength = pts.length;

      for (let i = 0; i < droneCount; i++) {
        targets[i] = pts[i % ptsLength];
      }
      targets.length = droneCount;
    },
    [droneCount, shapes]
  );

  // Pre-create gradient for reuse
  const gradientRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.clientWidth;
    let H = canvas.clientHeight;
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.scale(DPR, DPR);

      // Update gradient
      gradientRef.current = ctx.createLinearGradient(-8, -8, 8, 8);
      gradientRef.current.addColorStop(0, "#6EC1FF");
      gradientRef.current.addColorStop(0.5, "#8A5CFF");
      gradientRef.current.addColorStop(1, "#FF3EA5");

      setTargets(W, H, currentShape);
    };

    resize();
    initDrones(W, H);

    // Optimized animation with requestAnimationFrame timing
    const animate = (currentTime) => {
      if (!paused) {
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        // Adaptive frame rate - skip frames if performance drops
        if (deltaTime < 100) {
          // Don't skip if more than 100ms passed
          // Background with trail effect
          ctx.fillStyle = "rgba(5, 5, 16, 0.25)";
          ctx.fillRect(0, 0, W, H);

          const accel = 0.06 * speed;
          const damp = 0.92;
          const drones = dronesRef.current;
          const targets = targetsRef.current;

          // Set shadow properties once
          ctx.shadowColor = "rgba(138, 92, 255, 0.7)";
          ctx.shadowBlur = 12;
          ctx.fillStyle = gradientRef.current;

          // Optimized loop with fewer calculations
          for (let i = 0; i < droneCount; i++) {
            const d = drones[i];
            const t = targets[i];

            if (d && t) {
              // Calculate forces
              const dx = t.x - d.x;
              const dy = t.y - d.y;
              const ax = dx * accel;
              const ay = dy * accel;

              // Update velocity and position
              d.vx = (d.vx + ax) * damp;
              d.vy = (d.vy + ay) * damp;
              d.x += d.vx;
              d.y += d.vy;

              // Draw drone
              ctx.beginPath();
              ctx.arc(d.x, d.y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [droneCount, speed, paused, currentShape, initDrones, setTargets]);

  // Memoized tool definitions
  const toolDefs = useMemo(
    () => [
      { id: "X", label: "X Formation" },
      { id: "Heart", label: "❤️ Heart" },
      { id: "Circle", label: "⭕ Circle" },
      { id: "Wave", label: "〰️ Wave" },
      { id: "LuminaX", label: "LuminaX" },
    ],
    []
  );

  return (
    <div
      className="bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-transparent p-5 border border-white/10 rounded-3xl max-w-5xl mx-auto"
      style={{
        background:
          "radial-gradient(800px 500px at 50% -10%, rgba(255, 62, 165, 0.12), transparent 50%), #070716",
      }}
    >
      <div className="flex flex-wrap gap-3 mb-5 justify-center">
        {toolDefs.map((tool) => (
          <button
            key={tool.id}
            className={`px-5 py-2.5 rounded-full bg-white/5 border border-white/10 cursor-pointer font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 ${
              currentShape === tool.id
                ? "bg-gradient-to-r from-cyan-400 to-purple-500 border-transparent shadow-lg shadow-cyan-400/30"
                : ""
            }`}
            onClick={() => setCurrentShape(tool.id)}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-96 block rounded-2xl border border-white/10"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% -300px, rgba(110, 193, 255, 0.08), transparent 60%), radial-gradient(500px 400px at 80% 120%, rgba(255, 62, 165, 0.08), transparent 70%), #050510",
        }}
        aria-label="Swarm Simulator"
      />

      <div className="flex flex-col md:flex-row gap-8 mt-5 justify-center items-center">
        <div className="text-center">
          <label className="block text-sm text-blue-200 mb-2">
            Drones: <span>{droneCount}</span>
          </label>
          <input
            type="range"
            min="60"
            max="800"
            value={droneCount}
            onChange={(e) => setDroneCount(Number(e.target.value))}
            className="w-44 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div className="text-center">
          <label className="block text-sm text-blue-200 mb-2">
            Speed: <span>{speed.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0.3"
            max="2.2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-44 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div className="flex gap-4">
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-none rounded-full cursor-pointer font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-none rounded-full cursor-pointer font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
            onClick={() =>
              initDrones(
                canvasRef.current?.clientWidth,
                canvasRef.current?.clientHeight
              )
            }
          >
            Reset
          </button>
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-blue-200/60">
        Optimized version with improved performance and memory usage
      </div>
    </div>
  );
};
