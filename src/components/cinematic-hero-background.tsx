"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CinematicHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate route path
    const pathElement = document.querySelector('.animated-route');
    if (pathElement) {
      gsap.fromTo(
        pathElement,
        {
          strokeDashoffset: 2000,
        },
        {
          strokeDashoffset: 0,
          duration: 4,
          ease: "power2.inOut",
          delay: 0.5,
        }
      );
    }

    // Animate route dots
    const dots = document.querySelectorAll('.route-dot');
    dots.forEach((dot, index) => {
      gsap.to(dot, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.8 + index * 0.2,
        ease: "back.out(1.7)",
      });

      // Pulse animation
      gsap.to(dot, {
        scale: 1.3,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5 + index * 0.2,
      });
    });

    // Animate markers
    gsap.to('.usa-marker', {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay: 1.2,
      ease: "elastic.out(1, 0.5)",
    });

    gsap.to('.romania-marker', {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay: 1.5,
      ease: "elastic.out(1, 0.5)",
    });

    // Marker pulse
    gsap.to('.marker-pulse', {
      scale: 1.5,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: "power2.out",
    });

    // Create floating particles
    const createParticles = () => {
      if (!particlesRef.current) return;

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 3 + 1}px;
          height: ${Math.random() * 3 + 1}px;
          background: ${Math.random() > 0.5 ? '#60A5FA' : '#F59E0B'};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: 0;
        `;
        particlesRef.current.appendChild(particle);

        gsap.to(particle, {
          opacity: Math.random() * 0.7 + 0.3,
          y: `-=${Math.random() * 100 + 50}`,
          x: `+=${Math.random() * 40 - 20}`,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          ease: "none",
          delay: Math.random() * 2,
        });
      }
    };

    createParticles();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Cinematic Space Background - Pure CSS - Responsive */}
      <div className="absolute inset-0 scale-150 sm:scale-125 md:scale-110 lg:scale-100 origin-center">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

        {/* Star field effect */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 90%, white, transparent),
            radial-gradient(2px 2px at 45% 20%, white, transparent)
          `,
          backgroundSize: '200% 200%',
          opacity: 0.4,
        }} />

        {/* USA region glow (left) */}
        <div className="absolute left-[15%] top-[45%] w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute left-[20%] top-[40%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-2xl" />

        {/* Romania/Europe region glow (right) */}
        <div className="absolute right-[15%] top-[40%] w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute right-[20%] top-[35%] w-[300px] h-[300px] bg-orange-400/10 rounded-full blur-2xl" />

        {/* Atmospheric layers - Uniform background with subtle bottom darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/50" />
        <div className="absolute inset-0 opacity-30 bg-slate-950/20" />
      </div>

      {/* Particles Container - Responsive */}
      <div ref={particlesRef} className="absolute inset-0 scale-150 sm:scale-125 md:scale-110 lg:scale-100 origin-center" />

      {/* SVG Route Overlay - Responsive */}
      <svg
        className="absolute inset-0 w-full h-full scale-150 sm:scale-125 md:scale-110 lg:scale-100 origin-center"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="usaGlow">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="romaniaGlow">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
          </radialGradient>

          {/* Filters for softer glow effects */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main Route Arc */}
        <path
          className="animated-route"
          d="M 400,540 Q 960,200 1520,480"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="2000"
          strokeDashoffset="2000"
          filter="url(#glow)"
          strokeLinecap="round"
        />

        {/* Route Dots */}
        {[0, 1, 2, 3, 4, 5, 6].map((index) => {
          const positions = [
            { x: 400, y: 540 },
            { x: 600, y: 420 },
            { x: 800, y: 330 },
            { x: 960, y: 280 },
            { x: 1120, y: 310 },
            { x: 1320, y: 380 },
            { x: 1520, y: 480 },
          ];

          return (
            <circle
              key={index}
              className="route-dot"
              cx={positions[index].x}
              cy={positions[index].y}
              r="6"
              fill={index < 3 ? "#60A5FA" : index === 3 ? "#3B82F6" : "#F59E0B"}
              opacity="0"
              filter="url(#glow)"
            />
          );
        })}

        {/* USA Marker - Aligned with route start point */}
        <g className="usa-marker" opacity="0" transform="translate(400, 540) scale(0.8)">
          {/* Pulse rings - softer glow */}
          <circle
            className="marker-pulse"
            r="30"
            fill="url(#usaGlow)"
            opacity="0.35"
          />
          <circle
            className="marker-pulse"
            r="30"
            fill="url(#usaGlow)"
            opacity="0.2"
            style={{ animationDelay: '0.5s' }}
          />

          {/* Marker core */}
          <circle
            r="12"
            fill="#60A5FA"
            opacity="0.9"
          />
          <circle
            r="8"
            fill="#93C5FD"
          />

          {/* Marker pin */}
          <path
            d="M 0,-20 L 0,-35 M -3,-32 L 0,-35 L 3,-32"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* USA Flag */}
          <g transform="translate(-30, -65)">
            <rect x="0" y="0" width="60" height="36" fill="#B22234" rx="3"/>
            <rect x="0" y="0" width="60" height="4.5" fill="white"/>
            <rect x="0" y="9" width="60" height="4.5" fill="white"/>
            <rect x="0" y="18" width="60" height="4.5" fill="white"/>
            <rect x="0" y="27" width="60" height="4.5" fill="white"/>
            <rect x="0" y="0" width="24" height="18" fill="#3C3B6E"/>
            {/* Stars simplified as small circles */}
            <circle cx="6" cy="4" r="1.5" fill="white"/>
            <circle cx="12" cy="4" r="1.5" fill="white"/>
            <circle cx="18" cy="4" r="1.5" fill="white"/>
            <circle cx="6" cy="9" r="1.5" fill="white"/>
            <circle cx="12" cy="9" r="1.5" fill="white"/>
            <circle cx="18" cy="9" r="1.5" fill="white"/>
            <circle cx="6" cy="14" r="1.5" fill="white"/>
            <circle cx="12" cy="14" r="1.5" fill="white"/>
            <circle cx="18" cy="14" r="1.5" fill="white"/>
          </g>

          {/* Location label */}
          <text x="0" y="65" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" opacity="0.9">USA</text>
        </g>

        {/* Romania Marker - Aligned with route end point */}
        <g className="romania-marker" opacity="0" transform="translate(1520, 480) scale(0.8)">
          {/* Pulse rings - softer glow */}
          <circle
            className="marker-pulse"
            r="30"
            fill="url(#romaniaGlow)"
            opacity="0.35"
          />
          <circle
            className="marker-pulse"
            r="30"
            fill="url(#romaniaGlow)"
            opacity="0.2"
            style={{ animationDelay: '0.5s' }}
          />

          {/* Marker core */}
          <circle
            r="12"
            fill="#F59E0B"
            opacity="0.9"
          />
          <circle
            r="8"
            fill="#FCD34D"
          />

          {/* Marker pin */}
          <path
            d="M 0,-20 L 0,-35 M -3,-32 L 0,-35 L 3,-32"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Romania Flag */}
          <g transform="translate(-30, -65)">
            <rect x="0" y="0" width="20" height="36" fill="#002B7F" rx="3"/>
            <rect x="20" y="0" width="20" height="36" fill="#FCD116"/>
            <rect x="40" y="0" width="20" height="36" fill="#CE1126" rx="3"/>
          </g>

          {/* Location label */}
          <text x="0" y="65" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" opacity="0.9">ROMÂNIA</text>
        </g>

        {/* Moving Car Icon along path (replacing the circle) */}
        <g filter="url(#glow)">
          <g transform="translate(-15, -10)">
            {/* Car body */}
            <rect x="0" y="10" width="30" height="12" fill="#60A5FA" rx="2"/>
            {/* Car cabin */}
            <path d="M 5,10 L 10,4 L 20,4 L 25,10 Z" fill="#3B82F6"/>
            {/* Windows */}
            <rect x="7" y="6" width="6" height="3" fill="#E0F2FE" opacity="0.8"/>
            <rect x="17" y="6" width="6" height="3" fill="#E0F2FE" opacity="0.8"/>
            {/* Wheels */}
            <circle cx="8" cy="22" r="3" fill="#1E293B"/>
            <circle cx="22" cy="22" r="3" fill="#1E293B"/>
            <circle cx="8" cy="22" r="1.5" fill="#64748B"/>
            <circle cx="22" cy="22" r="1.5" fill="#64748B"/>
            {/* Headlights */}
            <circle cx="28" cy="14" r="1.5" fill="#FCD34D" opacity="0.9"/>
            <circle cx="28" cy="18" r="1.5" fill="#FCD34D" opacity="0.9"/>
          </g>

          <animateMotion
            dur="12s"
            repeatCount="indefinite"
            path="M 400,540 Q 960,200 1520,480"
          />

          {/* Rotation along path */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="0"
            dur="12s"
            repeatCount="indefinite"
          />
        </g>

        {/* Light rays */}
        <g opacity="0.1">
          <line x1="400" y1="540" x2="400" y2="0" stroke="url(#usaGlow)" strokeWidth="1" />
          <line x1="1520" y1="480" x2="1520" y2="0" stroke="url(#romaniaGlow)" strokeWidth="1" />
        </g>
      </svg>

      {/* Bottom fade gradient - Subtle transition - Responsive */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white/10 via-white/5 to-transparent" />
    </div>
  );
}
