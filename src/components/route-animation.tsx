"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function RouteAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate dots along the route
    const animateDots = () => {
      dotsRef.current.forEach((dot, index) => {
        if (!dot) return;

        gsap.to(dot, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.3,
          ease: "power2.out",
        });

        gsap.to(dot, {
          opacity: 0.3,
          scale: 0.8,
          duration: 1,
          delay: index * 0.3 + 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    };

    const timer = setTimeout(animateDots, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 md:opacity-30"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* USA Map Outline (Simplified) */}
        <g className="text-slate-400/40" transform="translate(100, 200)">
          <path
            d="M100,200 L150,180 L180,200 L200,190 L220,210 L250,200 L280,220 L300,210 L320,230 L300,250 L280,240 L260,260 L240,250 L220,270 L200,260 L180,280 L160,270 L140,250 L120,260 L100,240 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="5,5"
          />
          <text x="180" y="320" className="text-xs fill-slate-400 font-semibold" textAnchor="middle">
            USA
          </text>
        </g>

        {/* Europe/Romania Map Outline (Simplified) */}
        <g className="text-slate-400/40" transform="translate(1450, 250)">
          <path
            d="M100,150 L120,140 L140,150 L160,145 L180,155 L200,150 L220,160 L210,180 L190,170 L170,185 L150,175 L130,190 L110,180 L90,165 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="5,5"
          />
          <text x="155" y="230" className="text-xs fill-slate-400 font-semibold" textAnchor="middle">
            EUROPA
          </text>
        </g>

        {/* Animated Route Line */}
        <g>
          <path
            d="M380,280 Q960,200 1550,320"
            stroke="url(#routeGradient)"
            strokeWidth="2"
            fill="none"
            className="route-line"
          />

          {/* Route dots */}
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const positions = [
              { x: 380, y: 280 },
              { x: 650, y: 250 },
              { x: 920, y: 230 },
              { x: 1190, y: 250 },
              { x: 1370, y: 280 },
              { x: 1550, y: 320 },
            ];

            return (
              <circle
                key={index}
                ref={(el) => {
                  if (el) dotsRef.current[index] = el.parentElement as HTMLDivElement;
                }}
                cx={positions[index].x}
                cy={positions[index].y}
                r="4"
                fill="url(#dotGradient)"
                opacity="0"
                className="animate-pulse"
              />
            );
          })}

          {/* Moving dot along path */}
          <circle r="6" fill="#3B82F6" opacity="0.8">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path="M380,280 Q960,200 1550,320"
            />
          </circle>
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
          </linearGradient>

          <radialGradient id="dotGradient">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
