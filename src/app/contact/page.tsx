import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, Facebook, Clock } from "lucide-react";
import { GoogleReviewsCarousel } from "@/components/google-reviews-carousel";

export const metadata: Metadata = {
  title: "Contact - Suntem aici să te îndrumăm",
  description: "Contactează-ne pentru o consultanță gratuită și fără obligații. Răspundem prompt și clar la toate întrebările tale. Telefon: +40 764 806 987",
  openGraph: {
    title: "Contact | MC SUA",
    description: "Contactează-ne pentru o consultanță gratuită și fără obligații. Răspundem prompt și clar la toate întrebările tale.",
    images: ["/images/contract2.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | MC SUA",
    description: "Contactează-ne pentru o consultanță gratuită și fără obligații.",
  },
  alternates: {
    canonical: "https://mcsua.ro/contact",
  },
};

export default function Contact() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
              Suntem aici să te îndrumăm
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Contactează-ne pentru o consultanță gratuită și fără obligații. Răspundem prompt și clar la toate întrebările tale.
            </p>
          </div>
        </div>
      </section>

      {/* Date de contact */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
              Date de contact
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Telefon */}
              <Card className="border-0 shadow-xl hover-lift bg-white">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Telefon</h3>
                      <a
                        href="tel:+40764806987"
                        className="text-accent hover:text-accent/80 font-medium text-lg transition-colors"
                      >
                        +40 764 806 987
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card className="border-0 shadow-xl hover-lift bg-white">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                      <a
                        href="https://wa.me/40764806987?text=Salutare%21%20Ne%20bucur%C4%83m%20de%20interesul%20t%C4%83u%20pentru%20serviciile%20MC%20SUA%20de%20import%20auto.%0ATrimite-ne%20link-ul%20ma%C8%99inii%20dorite%20de%20pe%20www.copart.com%20sau%20www.iaai.com%20direct%20%C3%AEn%20acest%20chat%2C%20iar%20noi%20ne%20ocup%C4%83m%20de%20verificarea%20istoricului%20%C8%99i%20%C3%AE%C8%9Bi%20oferim%20feedback%20%C3%AEn%20cel%20mai%20scurt%20timp%21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 font-medium transition-colors"
                      >
                        Contact rapid prin WhatsApp
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Facebook */}
              <Card className="border-0 shadow-xl hover-lift bg-white">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Facebook className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Facebook</h3>
                      <a
                        href="https://www.facebook.com/Importuri?locale=ro_RO"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 font-medium transition-colors"
                      >
                        Ne poți găsi și pe Facebook
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Program */}
              <Card className="border-0 shadow-xl hover-lift bg-white">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Program</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Luni – Vineri: 10:00 – 19:00</p>
                        <p>Sâmbătă: 10:00 – 14:00</p>
                        <p>Duminică: Închis</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviewsCarousel />

      {/* FAQ Quick */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
              Întrebări frecvente înainte de contact
            </h2>
            <div className="space-y-6 text-left mt-16">
              <Card className="border-0 shadow-xl hover-lift bg-white">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Consultanța este gratuită?</h3>
                  <p className="text-muted-foreground">
                    Da, consultanța inițială este complet gratuită și fără obligații. Discutăm despre nevoile tale și îți oferim recomandări sincere.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl hover-lift bg-white">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Cât durează procesul complet?</h3>
                  <p className="text-muted-foreground">
                    În medie, procesul durează între 8 și 10 săptămâni, de la achiziție până la livrare în România.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl hover-lift bg-white">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Cum vă pot contacta?</h3>
                  <p className="text-muted-foreground">
                    Ne poți contacta telefonic, prin WhatsApp sau pe Facebook. Suntem disponibili în programul afișat mai sus și răspundem prompt la toate întrebările.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
