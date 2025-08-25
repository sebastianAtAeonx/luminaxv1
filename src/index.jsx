import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  applications,
  contactCards,
  NAVIGATION_ITEMS,
  SOCIAL_LINKS,
  techCards,
} from "./data";
import ParticlesCanvas from "./ParticlesCanvas.jsx";
import { SwarmSimulator } from "./Simulator.jsx";
import Slider from "react-slick";
// Custom Hooks
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
        ...options,
      }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
};

const useScrollProgress = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 100);

      const scrollPercentage =
        (scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setScrollProgress(Math.min(scrollPercentage, 100));
    };

    const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  return { scrolled, scrollProgress };
};

// Utility Functions
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId.toLowerCase());
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Components
const AnimatedLogo = React.memo(() => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-lg"
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
      {[
        { x: -15, y: -15, delay: 0 },
        { x: 15, y: -15, delay: 0.5 },
        { x: -15, y: 15, delay: 1 },
        { x: 15, y: 15, delay: 1.5 },
      ].map((circle, index) => (
        <circle
          key={index}
          cx={circle.x}
          cy={circle.y}
          r="3"
          fill={index % 2 === 0 ? "#7B2FBF" : "#00D4FF"}
          filter="url(#logoGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="2s"
            begin={`${circle.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="3;4;3"
            dur="2s"
            begin={`${circle.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

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
));

const CustomCursor = React.memo(() => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const moveCursor = throttle((e) => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;

        setTimeout(() => {
          if (followerRef.current) {
            followerRef.current.style.left = `${e.clientX - 10}px`;
            followerRef.current.style.top = `${e.clientY - 10}px`;
          }
        }, 100);
      }
    }, 16);

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-5 h-5 border-2 border-cyan-400 rounded-full pointer-events-none z-50 transition-transform duration-100 hidden lg:block"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={followerRef}
        className="fixed w-10 h-10 bg-cyan-400/10 rounded-full pointer-events-none z-40 transition-transform duration-200 hidden lg:block"
      />
    </>
  );
});

const MobileMenu = React.memo(({ isOpen, onClose }) => (
  <div
    className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
      isOpen ? "visible opacity-100" : "invisible opacity-0"
    }`}
  >
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    />
    <div
      className={`absolute right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-md border-l border-white/10 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-6">
        <button
          onClick={onClose}
          className="text-white hover:text-cyan-400 transition-colors duration-200"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav className="px-6">
        <ul className="space-y-6">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item}>
              <button
                className="block w-full text-left text-xl font-medium text-white hover:text-cyan-400 transition-colors duration-200"
                onClick={() => {
                  scrollToSection(item.toLowerCase());
                  onClose();
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
));

const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrolled } = useScrollProgress();

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed w-full px-4 sm:px-6 lg:px-12 py-5 z-40 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/95 py-4"
            : "bg-gradient-to-b from-gray-900/90 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative flex-shrink-0">
              <AnimatedLogo />
            </div>
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent tracking-wider animate-glow">
              LUMINAX
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-10 list-none">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item}>
                <button
                  className="text-white font-medium transition-all duration-300 relative py-1 hover:text-cyan-400 group"
                  onClick={() => scrollToSection(item.toLowerCase())}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-cyan-400 transition-colors duration-200 p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
});

const ScrollProgressBar = React.memo(() => {
  const { scrollProgress } = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-cyan-400 z-50 transition-all duration-100"
      style={{ width: `${scrollProgress}%` }}
    />
  );
});

const LoadingScreen = React.memo(() => (
  <div className="fixed inset-0 bg-black flex justify-center items-center z-50 transition-opacity duration-500">
    <div className="w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
  </div>
));

const FloatingElements = React.memo(() => (
  <div className="relative h-96 bg-gradient-to-br from-purple-600/10 to-cyan-400/10 rounded-3xl overflow-hidden backdrop-blur-md border border-white/10">
    {Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400 animate-float"
        style={{
          top: `${[20, 60, 40, 80, 30][i]}%`,
          left: `${[20, 70, 50, 30, 80][i]}%`,
          animationDelay: `${i}s`,
        }}
      />
    ))}
  </div>
));

const TechCard = React.memo(({ card, index }) => (
  <div className="bg-gradient-to-br from-purple-600/10 to-cyan-400/5 border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/20">
    <div className="absolute -top-full -left-full w-full h-full bg-gradient-to-br from-transparent via-cyan-400/30 to-transparent transition-all duration-500 group-hover:top-full group-hover:left-full transform rotate-45" />
    <span className="text-4xl sm:text-5xl mb-5 block relative z-10">
      {card.icon}
    </span>
    <h3 className="text-xl sm:text-2xl mb-4 text-cyan-400 relative z-10 font-semibold">
      {card.title}
    </h3>
    <p className="text-white/80 leading-relaxed relative z-10 text-sm sm:text-base">
      {card.description}
    </p>
  </div>
));

const ApplicationsCarousel = ({ applicationCardsMemoized }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    // centerMode: true,
    // centerPadding: "40px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2 mt-6">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 mt-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full opacity-60 hover:opacity-100 transition-opacity"></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
        },
      },
    ],
  };

  return <Slider {...settings}>{applicationCardsMemoized}</Slider>;
};

const ApplicationCard = React.memo(({ app, index }) => (
  <div className="px-3">
    {" "}
    {/* padding per slide */}
    <div className="h-100 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl p-1 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-600/40">
      <div className="h-full bg-black rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <span className="text-5xl sm:text-6xl mb-5 block">{app.icon}</span>
          <h3 className="text-2xl sm:text-3xl mb-4 bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            {app.title}
          </h3>
          <p className="text-white/80 leading-relaxed flex-grow text-sm sm:text-base">
            {app.description}
          </p>
        </div>
        <button
          className="mt-5 text-cyan-400 font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:gap-4 group"
          onClick={() => scrollToSection("contact")}
        >
          {app.cta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  </div>
));

const ContactCard = React.memo(({ card, index }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:bg-cyan-400/5 hover:border-cyan-400 hover:-translate-y-1">
    <span className="text-3xl sm:text-4xl mb-4 text-cyan-400 block">
      {card.icon}
    </span>
    <p className="text-xs sm:text-sm text-white/60 mb-1">{card.label}</p>
    <p className="text-base sm:text-lg text-white font-semibold break-all">
      {card.value}
    </p>
  </div>
));

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-purple-600 to-cyan-500 p-2 rounded-full shadow-md shadow-purple-600/30 hover:scale-110 transition-transform duration-300"
  >
    <span className="text-white text-sm">→</span>
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-purple-600 to-cyan-500 p-2 rounded-full shadow-md shadow-cyan-500/30 hover:scale-110 transition-transform duration-300"
  >
    <span className="text-white text-sm">←</span>
  </button>
);

// Main Component
const Index = () => {
  const [loading, setLoading] = useState(true);
  const [aboutRef, aboutVisible] = useIntersectionObserver();
  const [techRef, techVisible] = useIntersectionObserver();
  const [appsRef, appsVisible] = useIntersectionObserver();
  const [contactRef, contactVisible] = useIntersectionObserver();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDemoRequest = useCallback(() => {
    alert("Demo request feature would open a booking form");
  }, []);

  const handlePortfolioDownload = useCallback(() => {
    alert("Portfolio download would start here");
  }, []);

  const techCardsMemoized = useMemo(
    () =>
      techCards?.map((card, index) => (
        <TechCard key={index} card={card} index={index} />
      )) || [],
    []
  );

  const applicationCardsMemoized = useMemo(
    () =>
      applications?.map((app, index) => (
        <ApplicationCard key={index} app={app} index={index} />
      )) || [],
    [applications]
  );

  const contactCardsMemoized = useMemo(
    () =>
      contactCards?.map((card, index) => (
        <ContactCard key={index} card={card} index={index} />
      )) || [],
    []
  );
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-black text-white overflow-x-hidden cursor-crosshair">
      <CustomCursor />
      {/* <ScrollProgressBar /> */}
      <Navigation />

      {/* Hero Section */}
      <section
        className="min-h-screen relative flex items-center justify-center overflow-hidden px-4 sm:px-6"
        id="home"
        style={{
          background:
            "radial-gradient(ellipse at center, #0A0E27 0%, #000000 100%)",
        }}
      >
        <ParticlesCanvas />
        <div className="text-center z-20 relative max-w-7xl mx-auto">
          <h1 className="text-3xl px-2 py-3 sm:text-4xl md:text-6xl lg:text-8xl font-black mb-5 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent leading-tight tracking-tight">
            Where Technology
            <br />
            Meets Artistry in the Sky
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 font-medium tracking-wide max-w-4xl mx-auto md:whitespace-nowrap">
            Orchestrating 1000+ synchronized drones to paint your story across
            the cosmos
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              className="w-full sm:w-auto px-8 sm:px-10 py-4 text-lg font-semibold border-none rounded-full cursor-pointer transition-all duration-300 bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/40"
              onClick={handleDemoRequest}
            >
              Request Live Demo
            </button>
            <button
              className="w-full sm:w-auto px-8 sm:px-10 py-4 text-lg font-semibold bg-transparent text-white border-2 border-cyan-400 rounded-full cursor-pointer transition-all duration-300 shadow-lg shadow-cyan-400/20 hover:bg-cyan-400/10 hover:shadow-xl hover:shadow-cyan-400/40"
              onClick={() => scrollToSection("simulator")}
            >
              Try Simulator
            </button>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-black to-gray-900"
        id="simulator"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl px-3 py-5 sm:text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            Experience the Magic
          </h2>
          <p className="text-center text-lg sm:text-xl text-white/70 mb-12 sm:mb-16 font-light">
            Interactive drone swarm simulator - see your formations come to life
          </p>
          <SwarmSimulator />
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-black to-gray-900 transition-all duration-1000"
        id="about"
        ref={aboutRef}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            Redefining Celebrations Through Aerial Innovation
          </h2>
          <p className="text-center text-lg sm:text-xl text-white/70 mb-12 sm:mb-16 font-light">
            The future of entertainment is above us
          </p>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-base sm:text-lg leading-relaxed text-white/90 space-y-6">
              <p>
                LuminaX, powered by AeonX's cutting-edge technology, transforms
                the night sky into a living canvas. Our fleet of intelligent UAV
                swarms creates breathtaking aerial symphonies, merging precision
                engineering with artistic vision to deliver unforgettable
                experiences that transcend traditional entertainment.
              </p>
              <p>
                With zero emissions and infinite creative possibilities, we're
                not just creating shows — we're crafting memories that last a
                lifetime. Every performance is a testament to human imagination
                amplified by autonomous intelligence.
              </p>
            </div>
            <FloatingElements />
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden bg-gray-900 transition-all duration-1000"
        id="technology"
        ref={techRef}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl pb-3 sm:text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold leading-tight">
            Precision. Intelligence. Synchronization.
          </h2>
          <p className="text-center text-lg sm:text-xl text-white/70 mb-12 sm:mb-16 font-light">
            The technology that makes magic possible
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {techCardsMemoized}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-gray-900 to-black transition-all duration-1000"
        id="applications"
        ref={appsRef}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl pb-3 sm:text-4xl md:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            Elevate Every Occasion
          </h2>
          <p className="text-center text-lg sm:text-xl text-white/70 mb-12 sm:mb-16 font-light">
            From intimate celebrations to grand spectacles
          </p>

          {/* ✅ Just render the carousel here, no extra flex/overflow wrapper */}
          <ApplicationsCarousel
            applicationCardsMemoized={applicationCardsMemoized}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-gray-900 text-center relative overflow-hidden transition-all duration-1000"
        id="contact"
        ref={contactRef}
      >
        <div className="absolute top-1/2 left-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl py-5 mb-8 bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
            Ready to Light Up Your Sky?
          </h2>
          <p className="text-lg sm:text-xl text-white/70 mb-12 sm:mb-16 font-light">
            Let's create something extraordinary together
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
            {contactCardsMemoized}
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              className="w-full sm:w-auto px-8 sm:px-10 py-4 text-lg font-semibold border-none rounded-full cursor-pointer transition-all duration-300 bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/40"
              onClick={handleDemoRequest}
            >
              Request Live Demo
            </button>
            <button
              className="w-full sm:w-auto px-8 sm:px-10 py-4 text-lg font-semibold bg-transparent text-white border-2 border-cyan-400 rounded-full cursor-pointer transition-all duration-300 shadow-lg shadow-cyan-400/20 hover:bg-cyan-400/10 hover:shadow-xl hover:shadow-cyan-400/40"
              onClick={handlePortfolioDownload}
            >
              Download Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 sm:py-10 text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:-translate-y-1"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-white/50 text-sm px-4">
            © 2025 LuminaX by AeonX. All rights reserved. | Elevating moments,
            one drone at a time.
          </p>
        </div>
      </footer>

      {/* Custom Styles */}
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

        .animate-float {
          animation: float 6s infinite ease-in-out;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 10px rgba(123, 47, 191, 0.5));
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

        .scroll-container::-webkit-scrollbar {
          height: 8px;
        }

        .scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #7b2fbf, #00d4ff);
          border-radius: 4px;
        }

        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #8a5cff, #6ec1ff);
        }

        html {
          scroll-behavior: smooth;
        }

        /* Prevent horizontal scroll on mobile */
        body {
          overflow-x: hidden;
        }

        /* Custom focus styles for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #00d4ff;
          outline-offset: 2px;
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-gradient-to-r {
            background: white !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
