"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled
        ? "bg-white shadow-md py-1"
        : "bg-white py-2"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="MC SUA Logo"
              width={1568}
              height={784}
              quality={100}
              priority
              className="h-16 md:h-24 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Acasă
            </Link>
            <Link href="/cum-functioneaza" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Cum Funcționează
            </Link>
            <Link href="/servicii" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Servicii
            </Link>
            <Link href="/catalog" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Catalog
            </Link>
            <Link href="/calculator" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Calculator
            </Link>
            <Link href="/galerie" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Galerie
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Contact
            </Link>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/contact">Începe Procesul</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Acasă
            </Link>
            <Link
              href="/cum-functioneaza"
              className="block text-sm font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cum Funcționează
            </Link>
            <Link
              href="/servicii"
              className="block text-sm font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Servicii
            </Link>
            <Link
              href="/catalog"
              className="block text-sm font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Catalog
            </Link>
            <Link
              href="/calculator"
              className="block text-sm font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Calculator
            </Link>
            <Link
              href="/galerie"
              className="block text-sm font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Galerie
            </Link>
            <Link
              href="/contact"
              className="block text-sm font-medium text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Button asChild className="w-full bg-accent hover:bg-accent/90">
              <Link href="/contact">Începe Procesul</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
