import React, { useState, useEffect, useRef, useCallback } from "react";

// Custom Hook for Intersection Observer
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// Logo Component with inline styles for SVG animations
const AnimatedLogo = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#7B2FBF", stopOpacity: 1 }}>
          <animate
            attributeName="stop-color"
            values="#7B2FBF;#00D4FF;#7B2FBF"
            dur="4s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" style={{ stopColor: "#00D4FF", stopOpacity: 1 }}>
          <animate
            attributeName="stop-color"
            values="#00D4FF;#7B2FBF;#00D4FF"
            dur="4s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
      <filter id="logoGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <polygon
      points="60,15 95,40 95,80 60,105 25,80 25,40"
      fill="none"
      stroke="url(#logoGradient)"
      strokeWidth="2"
      filter="url(#logoGlow)"
    />

    <g transform="translate(60, 60)">
      <circle cx="-15" cy="-15" r="3" fill="#7B2FBF" filter="url(#logoGlow)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="15" cy="-15" r="3" fill="#00D4FF" filter="url(#logoGlow)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          begin="0.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="0"
        cy="0"
        r="5"
        fill="url(#logoGradient)"
        filter="url(#logoGlow)"
      >
        <animate
          attributeName="r"
          values="5;7;5"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="-15" cy="15" r="3" fill="#00D4FF" filter="url(#logoGlow)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="15" cy="15" r="3" fill="#7B2FBF" filter="url(#logoGlow)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          begin="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          begin="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      <line
        x1="-15"
        y1="-15"
        x2="15"
        y2="15"
        stroke="url(#logoGradient)"
        strokeWidth="1"
        opacity="0.3"
      >
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </line>
      <line
        x1="15"
        y1="-15"
        x2="-15"
        y2="15"
        stroke="url(#logoGradient)"
        strokeWidth="1"
        opacity="0.3"
      >
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="3s"
          begin="1.5s"
          repeatCount="indefinite"
        />
      </line>
    </g>
  </svg>
);

// Particles Animation Component
const ParticlesCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00D4FF";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      particles.forEach((a, index) => {
        particles.slice(index + 1).forEach((b) => {
          const distance = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${
              0.1 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-10"
    />
  );
};

// Swarm Simulator Component
const SwarmSimulator = () => {
  const canvasRef = useRef();
  const [droneCount, setDroneCount] = useState(200);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [currentShape, setCurrentShape] = useState("X");
  const dronesRef = useRef([]);
  const targetsRef = useRef([]);

  const rand = (a, b) => Math.random() * (b - a) + a;

  const shapes = {
    X: (W, H) => {
      const pts = [];
      const m = Math.min(W, H) * 0.35;
      const cx = W / 2,
        cy = H / 2;
      const step = 0.008;
      for (let t = -1; t <= 1; t += step) {
        pts.push({ x: cx + m * t, y: cy + m * t });
        pts.push({ x: cx + m * t, y: cy - m * t });
      }
      return jitter(pts, 2);
    },
    Heart: (W, H) => {
      const pts = [];
      const s = Math.min(W, H) * 0.03;
      const cx = W / 2,
        cy = H / 2 - 10;
      const step = 0.1;
      for (let t = 0; t < Math.PI * 2; t += step) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);
        pts.push({ x: cx + x * s, y: cy - y * s });
      }
      return jitter(densify(pts, 2), 1.5);
    },
    Circle: (W, H) => {
      const pts = [];
      const r = Math.min(W, H) * 0.3;
      const cx = W / 2,
        cy = H / 2;
      const step = (Math.PI * 2) / 200;
      for (let a = 0; a < Math.PI * 2; a += step) {
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
      const sx = (W - w) / 2,
        sy = (H - h) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = sx + (c / (cols - 1)) * w;
          const y =
            sy +
            (r / (rows - 1)) * h +
            Math.sin((c / cols) * Math.PI * 2 + r * 0.6) * 15;
          pts.push({ x, y });
        }
      }
      return jitter(pts, 1);
    },
    LuminaX: (W, H) => {
      const pts = [];
      const cx = W / 2,
        cy = H / 2;

      for (let i = 0; i < 20; i++) {
        pts.push({ x: cx - 120, y: cy - 40 + i * 4 });
      }
      for (let i = 0; i < 15; i++) {
        pts.push({ x: cx - 120 + i * 3, y: cy + 40 });
      }

      for (let t = -1; t <= 1; t += 0.1) {
        pts.push({ x: cx + 50 + t * 30, y: cy + t * 40 });
        pts.push({ x: cx + 50 + t * 30, y: cy - t * 40 });
      }

      return jitter(pts, 2);
    },
  };

  const densify = (pts, mult) => {
    const o = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i],
        b = pts[(i + 1) % pts.length];
      o.push(a);
      const k = Math.max(1, Math.floor(mult));
      for (let j = 1; j <= k; j++) {
        o.push({
          x: a.x + ((b.x - a.x) * j) / (k + 1),
          y: a.y + ((b.y - a.y) * j) / (k + 1),
        });
      }
    }
    return o;
  };

  const jitter = (pts, amt) => {
    return pts.map((p) => ({
      x: p.x + rand(-amt, amt),
      y: p.y + rand(-amt, amt),
    }));
  };

  const initDrones = useCallback(
    (W, H) => {
      dronesRef.current = Array.from({ length: droneCount }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        vx: 0,
        vy: 0,
      }));
      setTargets(W, H, currentShape);
    },
    [droneCount, currentShape]
  );

  const setTargets = useCallback(
    (W, H, shape) => {
      const pts = shapes[shape](W, H);
      targetsRef.current = Array.from(
        { length: droneCount },
        (_, i) => pts[i % pts.length]
      );
    },
    [droneCount]
  );

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
      setTargets(W, H, currentShape);
    };

    resize();
    initDrones(W, H);

    const animate = () => {
      if (!paused) {
        ctx.fillStyle = "rgba(5, 5, 16, 0.25)";
        ctx.fillRect(0, 0, W, H);

        const accel = 0.06 * speed;
        const damp = 0.92;

        for (let i = 0; i < droneCount; i++) {
          const d = dronesRef.current[i];
          const t = targetsRef.current[i];
          if (d && t) {
            const ax = (t.x - d.x) * accel;
            const ay = (t.y - d.y) * accel;
            d.vx = (d.vx + ax) * damp;
            d.vy = (d.vy + ay) * damp;
            d.x += d.vx;
            d.y += d.vy;

            const g = ctx.createLinearGradient(
              d.x - 8,
              d.y - 8,
              d.x + 8,
              d.y + 8
            );
            g.addColorStop(0, "#6EC1FF");
            g.addColorStop(0.5, "#8A5CFF");
            g.addColorStop(1, "#FF3EA5");

            ctx.beginPath();
            ctx.arc(d.x, d.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.shadowColor = "rgba(138, 92, 255, 0.7)";
            ctx.shadowBlur = 12;
            ctx.fill();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [droneCount, speed, paused, currentShape, initDrones, setTargets]);

  const toolDefs = [
    { id: "X", label: "X Formation" },
    { id: "Heart", label: "❤️ Heart" },
    { id: "Circle", label: "⭕ Circle" },
    { id: "Wave", label: "〰️ Wave" },
    { id: "LuminaX", label: "LuminaX" },
  ];

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
    </div>
  );
};

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef();
  const followerRef = useRef();

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";

        setTimeout(() => {
          followerRef.current.style.left = e.clientX - 10 + "px";
          followerRef.current.style.top = e.clientY - 10 + "px";
        }, 100);
      }
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-5 h-5 border-2 border-cyan-400 rounded-full pointer-events-none z-50 transition-transform duration-100"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={followerRef}
        className="fixed w-10 h-10 bg-cyan-400/10 rounded-full pointer-events-none z-40 transition-transform duration-200"
      />
    </>
  );
};

// Main App Component
const Index = () => {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [aboutRef, aboutVisible] = useIntersectionObserver();
  const [techRef, techVisible] = useIntersectionObserver();
  const [appsRef, appsVisible] = useIntersectionObserver();
  const [contactRef, contactVisible] = useIntersectionObserver();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 100);

      const scrollPercentage =
        (scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const techCards = [
    {
      icon: "🧠",
      title: "SwarmOS™",
      description:
        "Proprietary AI orchestration system that coordinates thousands of drones with millisecond precision, creating perfect formations every time.",
    },
    {
      icon: "⚡",
      title: "0.001s Response",
      description:
        "Real-time formation adjustments with near-instantaneous response times, ensuring flawless synchronization even in dynamic conditions.",
    },
    {
      icon: "🛡️",
      title: "SafetyNet Protocol",
      description:
        "Triple-redundant collision avoidance system with autonomous emergency protocols, making every show completely safe for audiences.",
    },
    {
      icon: "💡",
      title: "EcoGlow LEDs",
      description:
        "16.7 million colors with 50% less energy consumption. Our sustainable lighting technology creates brilliant displays while protecting our planet.",
    },
    {
      icon: "🌤️",
      title: "Weather Adaptive",
      description:
        "Advanced stabilization allows performances in winds up to 35 km/h, with real-time adjustments for optimal visibility in various conditions.",
    },
    {
      icon: "📡",
      title: "Neural Mesh Network",
      description:
        "Inter-drone communication creates a self-organizing network, enabling complex 3D formations and dynamic storytelling in the sky.",
    },
  ];

  const applications = [
    {
      icon: "🏢",
      title: "Corporate Events",
      description:
        "Transform product launches and company milestones into legendary moments. Create 3D logos, spell out messages, and leave lasting impressions on clients and employees.",
      cta: "Book Corporate Show",
    },
    {
      icon: "👑",
      title: "Weddings",
      description:
        "Write your love story across the stars. From proposals to receptions, create magical moments with personalized aerial displays that guests will never forget.",
      cta: "Plan Your Wedding",
    },
    {
      icon: "🎆",
      title: "National Celebrations",
      description:
        "Unite millions under one brilliant sky. Create patriotic displays, cultural symbols, and messages of unity that inspire entire nations.",
      cta: "Government Enquiry",
    },
    {
      icon: "🎵",
      title: "Festivals & Concerts",
      description:
        "Amplify experiences beyond imagination. Synchronize drone displays with music, creating immersive performances that blur the line between technology and art.",
      cta: "Create Festival Magic",
    },
  ];

  const contactCards = [
    { icon: "📧", label: "Email Us", value: "shows@luminax.aero" },
    { icon: "📱", label: "Call Us", value: "+91-98765-DRONE" },
    { icon: "📍", label: "Visit Us", value: "Mumbai, Delhi, Bangalore" },
    { icon: "🌐", label: "Website", value: "luminax.aero" },
  ];

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center z-50 transition-opacity duration-500">
        <div className="w-15 h-15 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="bg-black text-white overflow-x-hidden"
      style={{ cursor: "crosshair" }}
    >
      <CustomCursor />

      {/* Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-cyan-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <nav
        className={`fixed w-full px-12 py-5 z-40 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/95 py-4"
            : "bg-gradient-to-b from-gray-900/90 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <AnimatedLogo />
            </div>
            <div
              className="text-3xl font-black bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent tracking-wider"
              style={{
                filter: "drop-shadow(0 0 10px rgba(123, 47, 191, 0.5))",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              LUMINAX
            </div>
          </div>
          <ul className="hidden md:flex gap-10 list-none">
            {[
              "Home",
              "Simulator",
              "About",
              "Technology",
              "Applications",
              "Contact",
            ].map((item) => (
              <li key={item}>
                <button
                  className="text-white no-underline font-medium transition-all duration-300 relative py-1 hover:text-cyan-400 group"
                  onClick={() => scrollToSection(item.toLowerCase())}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="h-screen relative flex items-center justify-center overflow-hidden"
        id="home"
        style={{
          background:
            "radial-gradient(ellipse at center, #0A0E27 0%, #000000 100%)",
        }}
      >
        <ParticlesCanvas />
        <div className="text-center z-20 relative">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-5 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent leading-tight tracking-tight">
            Where Technology
            <br />
            Meets Artistry in the Sky
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 font-light tracking-wide">
            Orchestrating 1000+ synchronized drones to paint your story across
            the cosmos
          </p>
          <div className="flex gap-5 justify-center flex-wrap">
            <button
              className="px-10 py-4 text-lg font-semibold border-none rounded-full cursor-pointer transition-all duration-300 bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/40"
              onClick={() => scrollToSection("contact")}
            >
              Request Live Demo
            </button>
            <button
              className="px-10 py-4 text-lg font-semibold bg-transparent text-white border-2 border-cyan-400 rounded-full cursor-pointer transition-all duration-300 shadow-lg shadow-cyan-400/20 hover:bg-cyan-400/10 hover:shadow-xl hover:shadow-cyan-400/40"
              onClick={() => scrollToSection("simulator")}
            >
              Try Simulator
            </button>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section
        className="py-24 px-12  mx-auto bg-gradient-to-b from-black to-gray-900"
        id="simulator"
      >
        <h2 className="text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
          Experience the Magic
        </h2>
        <p className="text-center text-xl text-white/70 mb-16 font-light">
          Interactive drone swarm simulator - see your formations come to life
        </p>
        <SwarmSimulator />
      </section>

      {/* About Section */}
      <section
        className={`py-24 px-12 max-w-7xl mx-auto bg-gradient-to-b from-black to-gray-900 transition-all duration-1000 
         
        `}
        id="about"
        ref={aboutRef}
      >
        <h2 className="text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
          Redefining Celebrations Through Aerial Innovation
        </h2>
        <p className="text-center text-xl text-white/70 mb-16 font-light">
          The future of entertainment is above us
        </p>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-lg leading-relaxed text-white/90">
            <p className="mb-6">
              LuminaX, powered by AeonX's cutting-edge technology, transforms
              the night sky into a living canvas. Our fleet of intelligent UAV
              swarms creates breathtaking aerial symphonies, merging precision
              engineering with artistic vision to deliver unforgettable
              experiences that transcend traditional entertainment.
            </p>
            <p>
              With zero emissions and infinite creative possibilities, we're not
              just creating shows — we're crafting memories that last a
              lifetime. Every performance is a testament to human imagination
              amplified by autonomous intelligence.
            </p>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-purple-600/10 to-cyan-400/10 rounded-3xl overflow-hidden backdrop-blur-md border border-white/10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400"
                style={{
                  top: `${[20, 60, 40, 80, 30][i]}%`,
                  left: `${[20, 70, 50, 30, 80][i]}%`,
                  animation: `float 6s infinite ease-in-out ${i}s`,
                  animationDelay: `${i}s`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section
        className={`py-24 px-12 relative overflow-hidden bg-gray-900 transition-all duration-1000 `}
        id="technology"
        ref={techRef}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            Precision. Intelligence. Synchronization.
          </h2>
          <p className="text-center text-xl text-white/70 mb-16 font-light">
            The technology that makes magic possible
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techCards.map((card, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-600/10 to-cyan-400/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/20"
              >
                <div className="absolute -top-full -left-full w-full h-full bg-gradient-to-br from-transparent via-cyan-400/30 to-transparent transition-all duration-500 group-hover:top-full group-hover:left-full transform rotate-45"></div>
                <span className="text-5xl mb-5 block relative z-10">
                  {card.icon}
                </span>
                <h3 className="text-2xl mb-4 text-cyan-400 relative z-10">
                  {card.title}
                </h3>
                <p className="text-white/80 leading-relaxed relative z-10">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section
        className={`py-24 px-12 bg-gradient-to-b from-gray-900 to-black transition-all duration-1000 ${
          appsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        id="applications"
        ref={appsRef}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            Elevate Every Occasion
          </h2>
          <p className="text-center text-xl text-white/70 mb-16 font-light">
            From intimate celebrations to grand spectacles
          </p>
          <div className="flex gap-8 overflow-x-auto pb-5 scroll-smooth snap-x snap-mandatory">
            {applications.map((app, index) => (
              <div
                key={index}
                className="min-w-80 h-96 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl p-1 snap-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-600/40"
              >
                <div className="w-full h-full bg-black rounded-3xl p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-6xl mb-5 block">{app.icon}</span>
                    <h3 className="text-3xl mb-4 bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
                      {app.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed flex-grow">
                      {app.description}
                    </p>
                  </div>
                  <button
                    className="mt-5 text-cyan-400 no-underline font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:gap-4 group"
                    onClick={() => scrollToSection("contact")}
                  >
                    {app.cta}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className={`py-24 px-12 bg-gray-900 text-center relative overflow-hidden transition-all duration-1000 ${
          contactVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
        id="contact"
        ref={contactRef}
      >
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl mb-8 bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            Ready to Light Up Your Sky?
          </h2>
          <p className="text-xl text-white/70 mb-16 font-light">
            Let's create something extraordinary together
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {contactCards.map((card, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 hover:bg-cyan-400/5 hover:border-cyan-400 hover:-translate-y-1"
              >
                <span className="text-4xl mb-4 text-cyan-400 block">
                  {card.icon}
                </span>
                <p className="text-sm text-white/60 mb-1">{card.label}</p>
                <p className="text-lg text-white font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-5 justify-center flex-wrap">
            <button
              className="px-10 py-4 text-lg font-semibold border-none rounded-full cursor-pointer transition-all duration-300 bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/40"
              onClick={() =>
                alert("Demo request feature would open a booking form")
              }
            >
              Request Live Demo
            </button>
            <button
              className="px-10 py-4 text-lg font-semibold bg-transparent text-white border-2 border-cyan-400 rounded-full cursor-pointer transition-all duration-300 shadow-lg shadow-cyan-400/20 hover:bg-cyan-400/10 hover:shadow-xl hover:shadow-cyan-400/40"
              onClick={() => alert("Portfolio download would start here")}
            >
              Download Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10 text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-8 mb-8">
            {["📷", "🎬", "🦅", "💼"].map((icon, index) => (
              <a
                key={index}
                href="#"
                className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center text-white no-underline transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:-translate-y-1"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-white/50 text-sm">
            © 2025 LuminaX by AeonX. All rights reserved. | Elevating moments,
            one drone at a time.
          </p>
        </div>
      </footer>

      {/* Custom Styles for animations and slider */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(100px, -50px);
          }
          50% {
            transform: translate(-50px, -100px);
          }
          75% {
            transform: translate(-100px, 50px);
          }
        }

        @keyframes glow {
          from {
            filter: drop-shadow(0 0 10px rgba(123, 47, 191, 0.5));
          }
          to {
            filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8));
          }
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #6ec1ff, #8a5cff);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(110, 193, 255, 0.4);
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Index;
