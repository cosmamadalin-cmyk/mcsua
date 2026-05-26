"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  name: string;
  avatar: string;
  avatarBg: string;
  reviewCount: string;
  photoCount: string;
  timeAgo: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "FocusCayo",
    avatar: "F",
    avatarBg: "#4285F4",
    reviewCount: "3 recenzii",
    photoCount: "2 fotografii",
    timeAgo: "acum o zi",
    rating: 5,
    text: "Am achizitionat o masina prin intermediul lor anul trecut, totul a decurs perfect, de la achizitie, transport, procedura vamala, inmatriculare. Reparatia masinii am decis sa o fac tot cu ei, in momentul in care am preluat masina arata ca noua! Multumesc Cici pentru toate sfaturile si consultanta de care am avut parte pe tot parcursul acestei achizitii!",
  },
  {
    id: 2,
    name: "Constantin-Alexandru Pantea",
    avatar: "C",
    avatarBg: "#34A853",
    reviewCount: "3 recenzii",
    photoCount: "9 fotografii",
    timeAgo: "acum o zi",
    rating: 5,
    text: "O experienta foarte placuta si peste asteptari, desi nu ne cunosteam, am urmarit pagina de FB si dupa mai multe conversatii am hotarat sa import o masina. De acolo toate lucrurile au mers struna iar ei si echipa lui s-au ocupat de la import pana la reparatii si omologare. Practic am adus masina cu acte si reparata complet, pregatita de utilizare atat pe partea mecanica cat si pe partea de soft (EU). Profesionalism si transparenta la fiecare pas, am primit explicatii si detalii de fiecare data. Recomand cu drag!",
  },
  {
    id: 3,
    name: "Emanuel-Gabriel Serban",
    avatar: "E",
    avatarBg: "#EA4335",
    reviewCount: "2 recenzii",
    photoCount: "4 fotografii",
    timeAgo: "acum 2 zile",
    rating: 5,
    text: "Recomand cu cea mai mare incredere! Am colaborat cu echipa pentru achizitia unei masini din America si totul a decurs impecabil. De la primul contact si pana la livrarea finala, am avut parte de profesionalism, transparenta si comunicare excelenta. M-au ghidat pas cu pas prin tot procesul si au raspuns prompt la orice intrebare. Multumesc!",
  },
  {
    id: 4,
    name: "Laurentiu Dobrila",
    avatar: "L",
    avatarBg: "#9C27B0",
    reviewCount: "3 recenzii",
    photoCount: "0 fotografii",
    timeAgo: "acum o zi",
    rating: 5,
    text: "O firma de incredere, se ocupa de tot procesul si au tinut legatura tot timpul.\n\nAm mai colaborat si cu alte firme in trecut dar nu s-au tinut de cuvant cu nimic dupa ce si-au luat comisionul!!!\n\nRecomand cu incredere!!",
  },
  {
    id: 5,
    name: "Alexandru Calin",
    avatar: "A",
    avatarBg: "#00897B",
    reviewCount: "6 recenzii",
    photoCount: "8 fotografii",
    timeAgo: "acum 7 ore",
    rating: 5,
    text: "Seriozitate maxima!!! Recunosc, la inceput am avut dubii in urma unei alte colaborari cu alti baieti, nu are rost sa dau detalii despre ceilalti ca ar insemna sa scriu '10 pagini', insa ce tine de MC SUA, nota 10 si serios vb. pe aceasta cale le multumesc pentru rabdarea avuta cu mine si sper sa vina cat mai repede urmatoarea masina.\n\nP.S. Ii recomand cu drag fara doar si poate pe acesti baieti!!!",
  },
  {
    id: 6,
    name: "Bliss Motors",
    avatar: "B",
    avatarBg: "#E91E63",
    reviewCount: "5 recenzii",
    photoCount: "5 fotografii",
    timeAgo: "acum 3 zile",
    rating: 5,
    text: "Colaborare excelenta! Profesionalism de la inceput pana la final. Echipa MC SUA a demonstrat ca se poate lucra serios si cu incredere in acest domeniu. Comunicare prompta, preturi corecte si livrare la timp. Am adus deja 3 masini prin ei si suntem foarte multumiti. Recomand cu incredere pentru oricine cauta un partener de incredere pe termen lung.",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds
const RESUME_DELAY = 3000; // 3 seconds after interaction

export function GoogleReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, reviews.length - cardsPerView);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Loop back to start
      }
      return prev + 1;
    });
  }, [maxIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex; // Loop to end
      }
      return prev - 1;
    });
  }, [maxIndex]);

  // Autoplay logic
  useEffect(() => {
    if (isPaused) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      return;
    }

    autoplayRef.current = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isPaused, goToNext]);

  // Pause and resume helpers
  const pauseAutoplay = useCallback(() => {
    setIsPaused(true);

    // Clear any existing resume timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    // Set timeout to resume autoplay
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, RESUME_DELAY);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Handle manual navigation
  const handlePrevious = () => {
    pauseAutoplay();
    goToPrevious();
  };

  const handleNext = () => {
    pauseAutoplay();
    goToNext();
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse handlers for hover pause
  const onMouseEnter = () => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const onMouseLeave = () => {
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, RESUME_DELAY);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Recenzii Google
              </h2>
              <p className="text-sm text-gray-500">
                Ce spun clienții noștri
              </p>
            </div>
          </div>

          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
              aria-label="Recenzia anterioară"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
              aria-label="Recenzia următoare"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative overflow-hidden"
          ref={containerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <div className="bg-white rounded-2xl p-5 h-[320px] border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Avatar - Always letter initial */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                      style={{ backgroundColor: review.avatarBg }}
                    >
                      {review.avatar}
                    </div>

                    {/* Name & Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {review.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {review.reviewCount} · {review.photoCount}
                      </p>
                    </div>
                  </div>

                  {/* Rating Row */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                      NOU
                    </span>
                  </div>

                  {/* Review Text - Full text with scroll if needed */}
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {review.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex md:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            aria-label="Recenzia anterioară"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: reviews.length }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-accent w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            aria-label="Recenzia următoare"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <a
              href="https://share.google/fetkTJQIuyp1Hh3Wh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path
                  fill="#fff"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#fff"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fff"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#fff"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Vezi toate recenziile pe Google
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
