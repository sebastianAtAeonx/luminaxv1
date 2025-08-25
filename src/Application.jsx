import { useEffect, useRef, useState } from "react";
import { applications } from "./data";

export const ApplicationsSection = () => {
  const appsRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === applications.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="py-12 md:py-24 bg-gradient-to-b from-gray-900 to-black transition-all duration-1000"
      id="applications"
      ref={appsRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 text-center bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
          Elevate Every Occasion
        </h2>
        <p className="text-center text-lg sm:text-xl text-white/70 mb-12 md:mb-16 font-light max-w-3xl mx-auto">
          From intimate celebrations to grand spectacles
        </p>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {applications.map((app, index) => (
              <div
                key={index}
                className="min-w-full sm:min-w-[70%] md:min-w-[45%] lg:min-w-[30%] flex-shrink-0 px-2 sm:px-4"
              >
                <div className="h-96 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl p-1 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-600/40">
                  <div className="w-full h-full bg-black rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-5 block">
                        {app.icon}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent font-bold">
                        {app.title}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base leading-relaxed flex-grow">
                        {app.description}
                      </p>
                    </div>
                    <button
                      className="mt-4 sm:mt-5 text-cyan-400 no-underline font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:gap-4 group"
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
            ))}
          </div>
          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {applications.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-cyan-400 scale-125"
                    : "bg-white/30"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
