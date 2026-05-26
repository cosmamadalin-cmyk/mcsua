"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShowBanner(false);
  };

  // Don't render anything on server or if banner shouldn't show
  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg p-4 md:p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Acest site utilizează cookie-uri pentru a îmbunătăți experiența de navigare.
              Continuând să utilizați site-ul, sunteți de acord cu utilizarea cookie-urilor
              conform <Link href="/politica-de-confidentialitate" className="text-accent underline hover:text-accent/80 transition-colors">Politicii de Confidențialitate</Link>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
            <Button
              onClick={handleAccept}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              Accept
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="border-slate-300 hover:bg-slate-100"
            >
              Refuz
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
            >
              <Link href="/politica-de-confidentialitate">
                Vezi politica de confidențialitate
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
