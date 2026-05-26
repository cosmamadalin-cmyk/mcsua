"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Shield,
  TrendingDown,
  Clock,
  MessageSquare,
  Search,
  FileCheck,
  Gavel,
  Ship,
  FileText,
  Car
} from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { CinematicHeroBackground } from "@/components/cinematic-hero-background";
import { GoogleReviewsCarousel } from "@/components/google-reviews-carousel";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredCarsReveal = useScrollReveal();
  const valuePropReveal = useScrollReveal();
  const processReveal = useScrollReveal();
  const benefitsReveal = useScrollReveal();
  const galleryReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const faqReveal = useScrollReveal();

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section - Premium Redesign - Responsive */}
      <section className="relative min-h-[100vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FFFFFF00]">
        {/* Cinematic Earth Background with Animated Route */}
        <CinematicHeroBackground />

        {/* Hero Content Container - Responsive */}
        <div className="container mx-auto px-4 sm:px-6 sm:py-20 relative z-10 py-[0px]">
          <div className="flex items-center justify-center min-h-[80vh] sm:min-h-[70vh]">
            {/* Centered Text Content with Gradient Backdrop - Responsive */}
            <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 md:space-y-10 relative">
              {/* Subtle gradient backdrop only for lower text area - Responsive */}
              <div className="absolute inset-0 -inset-x-6 sm:-inset-x-12 -inset-y-16 sm:-inset-y-24 bg-gradient-to-b from-transparent via-transparent to-slate-900/35 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl -z-10" />

              <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] tracking-tight opacity-0 ${mounted ? 'animate-slide-up' : ''} drop-shadow-2xl px-2 sm:px-4`}>
                Specialiștii tăi de încredere în intermedierea auto din SUA
              </h1>

              <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-100/90 leading-relaxed opacity-0 ${mounted ? 'animate-slide-up animate-delay-200' : ''} drop-shadow-xl max-w-3xl mx-auto px-2 sm:px-4 font-light`}>
                Îți aducem mașina dorită din SUA, de la licitație până acasă — simplu, sigur și transparent.
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center pt-2 sm:pt-4 opacity-0 ${mounted ? 'animate-slide-up animate-delay-400' : ''}`}>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white btn-premium text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 hover-glow shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  <Link href="/contact">Începe Procesul</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="hero-outline-btn border-2 border-white/40 bg-white/5 hover:bg-accent hover:border-accent text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02] font-semibold w-full sm:w-auto"
                >
                  <Link href="/cum-functioneaza">
                    Cum Funcționează
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators - Compact and readable - Responsive */}
              <div className={`flex flex-wrap gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 justify-center items-center opacity-0 ${mounted ? 'animate-fade-in animate-delay-600' : ''} max-w-2xl mx-auto -translate-y-1.5 relative px-2`}>
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 -inset-x-6 sm:-inset-x-12 -inset-y-2 sm:-inset-y-3 rounded-xl sm:rounded-2xl backdrop-blur-sm -z-10 bg-[#FFFFFF00]" />

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 drop-shadow-lg opacity-95 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-md opacity-95">Transparență totală</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 drop-shadow-lg opacity-95 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-md opacity-95">Consultanță permanentă</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 drop-shadow-lg opacity-95 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-md opacity-95">8-10 săptămâni</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Banner */}
      <section className="bg-gradient-to-r from-accent to-blue-700 py-6 sm:py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-xl hidden sm:block">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">Calculator Cost Import Auto</p>
                <p className="text-blue-100 text-sm">Estimează costul total — licitație, transport, vamă, TVA</p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-accent hover:bg-white/90 font-bold shadow-lg whitespace-nowrap">
              <Link href="/calculator">Calculează acum →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Google Reviews Carousel */}
      <GoogleReviewsCarousel />

      {/* Tipuri de mașini populare */}
      <section ref={featuredCarsReveal.ref} className={`py-24 bg-white transition-all duration-700 ${featuredCarsReveal.isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Descoperă varietatea pieței americane
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              De la SUV-uri premium la muscle cars iconice, de la pickup-uri robuste la mașini electrice de ultimă generație. Piața americană oferă exact ce îți dorești.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift cinematic-overlay image-zoom-container">
                <img
                  src="https://ugc.same-assets.com/GvkfqDF9viiJszbsNYv0xg4Xg0lXTNrM.webp"
                  alt="BMW X5 - SUV Premium"
                  className="w-full h-full object-cover image-zoom"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">SUV-uri Premium</h3>
              <p className="text-muted-foreground">BMW, Mercedes, Audi, Cadillac</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift cinematic-overlay image-zoom-container">
                <img
                  src="https://ugc.same-assets.com/8Kfe7YqF4VLTQpBR4v_mCL8NI8DSTeam.png"
                  alt="Dodge Charger - Muscle Car"
                  className="w-full h-full object-cover image-zoom"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Muscle Cars</h3>
              <p className="text-muted-foreground">Dodge Charger, Mustang, Camaro</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift cinematic-overlay image-zoom-container">
                <img
                  src="https://ugc.same-assets.com/-0tixku9EpjbXEMMpLMyI8TKlrG9uoVT.webp"
                  alt="RAM 1500 - Pickup Truck"
                  className="w-full h-full object-cover image-zoom"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Pickup Trucks</h3>
              <p className="text-muted-foreground">RAM, Ford F-150, Silverado</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift cinematic-overlay image-zoom-container">
                <img
                  src="https://ugc.same-assets.com/XMebOolGfJSHW93R5khFwCazlssqiFr0.png"
                  alt="Tesla Model 3 - Electric Car"
                  className="w-full h-full object-cover image-zoom"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Mașini Electrice</h3>
              <p className="text-muted-foreground">Tesla, Rivian, Lucid</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ce face McSUA pentru tine */}
      <section ref={valuePropReveal.ref} className={`py-24 bg-gradient-to-b from-slate-50 to-white transition-all duration-700 ${valuePropReveal.isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Ce face MC SUA pentru tine
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Piața americană e vastă, complexă și plină de oportunități — dar și de incertitudini pentru cineva care pornește de la zero. Noi suntem echipa care îți înțelege nevoia și te asistă cu empatie, expertiză și transparență totală.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl">
                    <MessageSquare className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-primary">Expertiză în piața americană</h3>
                    <p className="text-muted-foreground">
                      Știm ce merită cumpărat și ce trebuie evitat. Cunoaștem platformele, istoricele vehiculelor și cum se interpretează gradele de avarii.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Recomandări personalizate & consultanță reală</h3>
                    <p className="text-muted-foreground">
                      Nu îți oferim un catalog rece. Discutăm cu tine, înțelegem ce îți dorești și îți propunem opțiuni care se potrivesc cu bugetul și așteptările tale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl">
                    <FileCheck className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Informații complete despre vehicul</h3>
                    <p className="text-muted-foreground">
                      Oferim detalii despre seller, istoricul accidentelor și fotografiile vehiculului exact așa cum sunt prezentate de seller pe platforma de licitație. Decizia de achiziție a mașinii aparține în totalitate clientului care achiziționează vehiculul.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Proces gestionat complet</h3>
                    <p className="text-muted-foreground">
                      De la primul apel până la livrare, ne ocupăm de tot. Tu ai liniște, comunicare constantă și certitudinea că procesul e în mâini bune.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA discret */}
          <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-[#0080FF] hover:bg-[#0080FF]/90 text-white transition-all duration-300">
              <Link href="/contact">Solicită îndrumare</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Procesul în 5 pași */}
      <section ref={processReveal.ref} className={`py-24 bg-gradient-to-b from-white via-slate-50 to-white transition-all duration-700 ${processReveal.isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Procesul în 5 pași
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Iată pe scurt cum aducem mașina ta din SUA până în România. Pentru detalii complete, vezi pagina dedicată procesului.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-l-4 border-l-accent shadow-lg hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                      <Search className="h-5 w-5 text-accent" />
                      Căutarea Mașinii
                    </h3>
                    <p className="text-muted-foreground">
                      Clientul accesează site-urile de licitații <a href="https://www.copart.com" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 transition-colors">Copart</a> și <a href="https://www.iaai.com" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 transition-colors">IAA</a> pentru a căuta mașina dorită.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent shadow-lg hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-accent" />
                      Consultanță și Îndrumare
                    </h3>
                    <p className="text-muted-foreground">
                      După identificarea mașinii dorite, clientul contactează MC SUA. Pe baza experienței noastre, oferim îndrumare dacă autoturismul merită sau nu să fie achiziționat. Evaluarea se face exclusiv pe baza istoricului accidentelor, fotografiilor publicate de seller și datelor tehnice prezentate în anunțul lotului auto.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent shadow-lg hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-accent" />
                      Stabilirea Bugetului și garanția
                    </h3>
                    <p className="text-muted-foreground">
                      Stabilim bugetul și emitem factura pentru garanția de licitație. În cazul în care licitația este câștigată și aprobată, se semnează contractul. Dacă licitația nu este câștigată, garanția se returnează.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent shadow-lg hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                      <Ship className="h-5 w-5 text-accent" />
                      Preluare în SUA și Transport
                    </h3>
                    <p className="text-muted-foreground">
                      Mașina ajunge în portul de export din SUA, unde este pregătită pentru plecare și încărcată în container. La încărcarea în container, clientul primește un set de fotografii realizate de colegii noștri. Se emit documentele de shipping, iar tu primești detaliile de tracking, însoțite de data estimată de plecare și de sosire în Europa. Nava ajunge în portul Bremerhaven din Germania. În această etapă se achită taxele de handling, taxele vamale și, după caz, TVA.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent shadow-lg hover-lift bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      Ultimul pas către destinația finală
                    </h3>
                    <p className="text-muted-foreground">
                      După finalizarea formalităților, colaboratorul nostru de transport auto preia autoturismul din portul Bremerhaven și îl livrează la adresa indicată. Oferim posibilitatea ca reparația autovehiculului să fie realizată prin echipa noastră, în colaborare cu service-uri autorizate din București. Procesul este monitorizat, documentat și prezentat pe canalele noastre de social media, gratuit. Asigurăm, fără costuri suplimentare, și omologarea R.A.R.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105">
              <Link href="/cum-functioneaza">Vezi Procesul Complet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Avantaje McSUA */}
      <section ref={benefitsReveal.ref} className={`py-24 bg-white transition-all duration-700 ${benefitsReveal.isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              De ce să alegi MC SUA
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Piața americană oferă mii de mașini extraordinare, dar fără cunoaștere reală, alegerile greșite costă scump. Noi suntem echipa care te îndrumă în procesul de import auto din SUA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-2 hover:border-accent/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full mb-4">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Transparență completă</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Primești mereu costul final estimat înainte de orice decizie. Știi exact ce plătești, pentru ce plătești și când plătești. Furnizăm tracking number-ul containerului la plecarea din SUA.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-accent/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full mb-4">
                  <TrendingDown className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Prețuri corecte</h3>
                <p className="text-muted-foreground leading-relaxed">
                  În Statele Unite, mașinile au prețuri mult mai competitive, iar licitațiile oferă acces la modele premium cu diferențe de mii de euro față de piața din România. Rolul nostru este să te îndrumăm astfel încât tu să selectezi mașina care merită. MC SUA nu selectează mașini în locul clientului.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-accent/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Comunicare constantă</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Știi mereu unde este mașina ta și ce urmează. Răspundem la întrebări prompt și clar.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-accent/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Timp economisit</h3>
                <p className="text-muted-foreground">
                  Nu pierzi timp cu formalități, căutări sau birocrație. Ne ocupăm noi de tot procesul.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-accent/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="inline-flex p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full mb-4">
                  <FileCheck className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Expertiză reală</h3>
                <p className="text-muted-foreground">
                  Echipa noastră cunoaște piața americană, procesul de intermediere, procesul de import și toate procedurile vamale.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA discret */}
          <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-[#0080FF] hover:bg-[#0080FF]/90 text-white transition-all duration-300">
              <Link href="/contact">Începe procesul</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Galerie importuri */}
      <section ref={galleryReveal.ref} className={`py-24 bg-gradient-to-b from-slate-50 to-white transition-all duration-700 ${galleryReveal.isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Mașini importate cu succes
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Fiecare mașină are o poveste. Fiecare client are acum vehiculul pe care și l-a dorit. Descoperă importuri reușite din SUA în România.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* BMW X5 */}
            <Link href="/galerie" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift border-0 h-full">
                <div className="aspect-[4/3] overflow-hidden cinematic-overlay image-zoom-container">
                  <img
                    src="https://ugc.same-assets.com/QotGBsjBrMZCCHS8NnV6icd4pFAzlyaz.jpeg"
                    alt="BMW X5"
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-xl mb-3 text-primary group-hover:text-accent transition-colors">
                    Chevrolet Corvette C8
                  </h3>
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Status: Import complet</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Livrare: România</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-sm text-accent font-semibold group-hover:underline">
                      Vezi în galerie →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Dodge Charger */}
            <Link href="/galerie" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift border-0 h-full">
                <div className="aspect-[4/3] overflow-hidden cinematic-overlay image-zoom-container">
                  <img
                    src="https://ugc.same-assets.com/JWBzYEkBkA3odEudcZ0A165U2DDFTNRK.jpeg"
                    alt="Dodge Charger"
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-xl mb-3 text-primary group-hover:text-accent transition-colors">
                    Mercedes-Benz
                  </h3>
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Status: Import complet</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Livrare: România</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-sm text-accent font-semibold group-hover:underline">
                      Vezi în galerie →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* RAM 1500 */}
            <Link href="/galerie" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift border-0 h-full">
                <div className="aspect-[4/3] overflow-hidden cinematic-overlay image-zoom-container">
                  <img
                    src="https://ugc.same-assets.com/wA67-6xSFxho_86Ky3jcZcNvRVrBw8KQ.jpeg"
                    alt="RAM 1500"
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-xl mb-3 text-primary group-hover:text-accent transition-colors">
                    Audi RS5
                  </h3>
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Status: Import complet</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Livrare: România</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-sm text-accent font-semibold group-hover:underline">
                      Vezi în galerie →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Tesla Model 3 */}
            <Link href="/galerie" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift border-0 h-full">
                <div className="aspect-[4/3] overflow-hidden cinematic-overlay image-zoom-container">
                  <img
                    src="https://ugc.same-assets.com/C64Tg9tJG4XtbTRb8VNmdES36k_q7Bep.jpeg"
                    alt="Tesla Model 3"
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-xl mb-3 text-primary group-hover:text-accent transition-colors">
                    BMW Seria 4
                  </h3>
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Status: Import complet</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Livrare: România</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-sm text-accent font-semibold group-hover:underline">
                      Vezi în galerie →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Ford Mustang */}
            <Link href="/galerie" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift border-0 h-full">
                <div className="aspect-[4/3] overflow-hidden cinematic-overlay image-zoom-container">
                  <img
                    src="https://ugc.same-assets.com/dqE8AbVAK_SGFUqdwK4bb2aSBytqJ0fz.jpeg"
                    alt="Ford Mustang"
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-xl mb-3 text-primary group-hover:text-accent transition-colors">
                    Porsche Macan
                  </h3>
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Status: Import complet</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Livrare: România</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-sm text-accent font-semibold group-hover:underline">
                      Vezi în galerie →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Chevrolet Camaro */}
            <Link href="/galerie" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift border-0 h-full">
                <div className="aspect-[4/3] overflow-hidden cinematic-overlay image-zoom-container">
                  <img
                    src="https://ugc.same-assets.com/JxtP4cKqHgRKtIwawrzC9WCJh340LFyV.jpeg"
                    alt="Chevrolet Camaro"
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-xl mb-3 text-primary group-hover:text-accent transition-colors">
                    Audi Q5
                  </h3>
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Status: Import complet</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Livrare: România</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-sm text-accent font-semibold group-hover:underline">
                      Vezi în galerie →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
            <Button asChild size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105">
              <Link href="/galerie">Vezi Galeria Completă</Link>
            </Button>
            <Button asChild size="lg" className="bg-[#0080FF] hover:bg-[#0080FF]/90 text-white transition-all duration-300">
              <Link href="/contact">Mergi la contact</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqReveal.ref} className={`py-24 bg-gradient-to-b from-slate-50 to-white transition-all duration-700 ${faqReveal.isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
              Întrebări frecvente
            </h2>
            <p className="text-xl text-muted-foreground mb-16 text-center leading-relaxed">
              Răspunsuri clare la întrebările tale cele mai importante.
            </p>

            <Accordion type="single" collapsible className="space-y-6">
              <AccordionItem value="item-1" className="bg-white px-8 py-2 rounded-2xl border-0 shadow-lg hover-lift">
                <AccordionTrigger className="text-left font-semibold">
                  Cât durează procesul de import complet?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Procesul de import durează între 8 și 10 săptămâni.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white px-8 py-2 rounded-2xl border-0 shadow-lg hover-lift">
                <AccordionTrigger className="text-left font-semibold">
                  Ce taxe și costuri sunt implicate?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sunt implicate garanția de licitație (care se returnează ulterior), taxele vamale, taxele de transport, după caz taxele de preschimbare a certificatului title și comisionul de intermediere. Estimarea costurilor se oferă în cadrul discuției inițiale, după selectarea lotului auto.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white px-8 py-2 rounded-2xl border-0 shadow-lg hover-lift">
                <AccordionTrigger className="text-left font-semibold">
                  Ce înseamnă gradele de avarii (Salvage, Clean Title etc.)?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  "Clean Title" înseamnă că mașina nu a avut daune majore și are istoric curat. "Salvage" indică daune semnificative declarate de asigurător. Îți explicăm pe înțeles ce înseamnă fiecare categorie și cum afectează valoarea și siguranța vehiculului.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white px-8 py-2 rounded-2xl border-0 shadow-lg hover-lift">
                <AccordionTrigger className="text-left font-semibold">
                  Cum funcționează licitațiile din SUA?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Licitațiile se desfășoară online pe platforme precum Copart și IAAI. Noi participăm în numele tău, setăm limita de preț pe care o agreăm împreună și licităm strategic pentru a obține cel mai bun preț.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white px-8 py-2 rounded-2xl border-0 shadow-lg hover-lift">
                <AccordionTrigger className="text-left font-semibold">
                  Pot vedea mașina înainte să iau decizia finală?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Cumpărătorul accesează site-urile de licitație menționate și, după alegerea lotului, transmite link-ul către echipa MC SUA prin modalitățile de contact disponibile. Urmează discuția de consultanță, realizată pe baza informațiilor furnizate de seller și a fotografiilor afișate online în cadrul lotului.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white px-8 py-2 rounded-2xl border-0 shadow-lg hover-lift">
                <AccordionTrigger className="text-left font-semibold">
                  Ce garanții am că mașina va ajunge în siguranță?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Colaborăm exclusiv cu firme de transport verificate și asigurate. Mașina este transportată în containere sau pe platforme specializate, iar tu primești actualizări regulate despre locația vehiculului.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-32 bg-gradient-to-br from-primary via-primary to-slate-900 text-primary-foreground overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            Gata să începi călătoria către mașina ta din America?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Suntem aici să te ghidăm cu încredere, transparență și expertiza pe care o meriti.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-xl h-16 px-12 btn-premium hover-glow shadow-2xl">
            <Link href="/contact">Contactează-ne Acum</Link>
          </Button>
        </div>
      </section>

      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeIn {
          0% { opacity: 0;}
          100% { opacity: 1;}
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .animate-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </main>
  );
}
