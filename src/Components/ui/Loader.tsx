import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed border border-[var(--color-border)] inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl px-8 sm:px-12 md:px-20 py-8 sm:py-12 md:py-16 flex flex-col items-center max-w-sm sm:max-w-md">
        <div className="relative mb-8">
          <div className="relative w-20 h-20">
            {[...Array(8)].map((_, i) => {
              const size = 0.25 + i * 0.125;
              const opacity = 0.3 + (i / 7) * 0.7;
              const radius = 32; // px, consistent radius for all circles
              const angle = i * 45 * (Math.PI / 180); // 45 degrees between each circle
              // Calculate position on the circle - center the circle on the path
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-[var(--color-text)]"
                  style={{
                    width: `${size}rem`,
                    height: `${size}rem`,
                    opacity: opacity,
                    left: `calc(50% + ${x}px - ${size / 2}rem)`,
                    top: `calc(50% + ${y}px - ${size / 2}rem)`,
                    animation: `loader-blink 1.2s linear infinite`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              );
            })}
          </div>
          <style>{`
            @keyframes loader-blink {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
        <div className="text-lg sm:text-xl md:text-2xl text-[var(--color-text)] text-center font-serif font-medium">
          Give us a moment while we
          read your documents!
        </div>
      </div>
    </div>
  );
};

export default Loader;
