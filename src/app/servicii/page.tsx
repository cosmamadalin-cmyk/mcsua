import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Search,
  FileCheck,
  Gavel,
  Ship,
  FileText,
  Shield,
  Calculator
} from "lucide-react";

export const metadata: Metadata = {
  title: "Servicii Complete de Import Auto",
  description: "De la consultanță până la livrare, oferim tot ce ai nevoie pentru a aduce mașina ta din SUA în România. Consultanță personalizată, verificare vehicule, participare licitații, transport internațional.",
  openGraph: {
    title: "Servicii Complete de Import Auto | MC SUA",
    description: "De la consultanță până la livrare, oferim tot ce ai nevoie pentru a aduce mașina ta din SUA în România.",
    images: ["/images/contract2.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicii Complete de Import Auto | MC SUA",
    description: "De la consultanță până la livrare, oferim tot ce ai nevoie pentru a aduce mașina ta din SUA în România.",
  },
  alternates: {
    canonical: "https://mcsua.ro/servicii",
  },
};

export default function Servicii() {
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
              Servicii Complete de Import Auto
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              De la consultanță până la livrare, oferim tot ce ai nevoie pentru a aduce mașina ta din SUA în România.
            </p>
          </div>
        </div>
      </section>

      {/* Servicii */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Consultanță */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <MessageSquare className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Consultanță Personalizată
                    </h2>
                    <p className="text-sm text-accent font-medium">Gratuită și fără obligații</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      Fiecare client are nevoi diferite. De aceea, procesul nostru începe cu o discuție sinceră și fără presiuni, în care ne spui exact ce îți dorești.
                    </p>
                    <p>
                      Pe baza experienței noastre în piața americană, îți oferim recomandări realiste: ce modele merită investiția, care sunt gradele de avarii acceptabile pentru bugetul tău, ce costuri finale poți aștepta.
                    </p>
                    <p className="font-semibold text-primary">
                      Nu plătești nimic pentru consultanță — doar discutăm deschis despre opțiunile tale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Căutare și Verificare */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <Search className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Căutare & Verificare Inițială
                    </h2>
                    <p className="text-sm text-accent font-medium">Acces la mii de vehicule</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      Tu cauți mașina dorită pe Copart / IAAI.
Ne trimiți linkul, iar noi verificăm: tipul avariei, istoricul disponibil, riscurile evidente, dacă merită sau nu licitată.
                    </p>
                    <p>

                    </p>
                    <p className="font-semibold text-primary">
                      Îți oferim feedback onest, dar decizia finală îți aparține. Noi suntem intermediarul — nu alegem mașina în locul tău.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verificare Detaliată */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <FileCheck className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Verificare Completă
                    </h2>
                    <p className="text-sm text-accent font-medium">Rapoarte și inspecție</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      Pentru fiecare vehicul selectat, evaluăm istoricul de daune și validăm autenticitatea informațiilor.
                    </p>
                    <p>

                    </p>
                    <p className="font-semibold text-primary">
                      Evaluarea se face exclusiv pe baza istoricului accidentelor, fotografiilor publicate de seller și datelor tehnice prezentate în anunțul lotului auto.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participare la Licitații */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <Gavel className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Participare la Licitații
                    </h2>
                    <p className="text-sm text-accent font-medium">Strategie profesională</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      După selectarea lotului, se emite factura pentru garanția de licitație. Dacă licitația este câștigată și aprobată, se semnează contractul. În caz contrar, garanția se returnează.
                    </p>
                    <p>
                      Această garanție este returnată ulterior, după ce autoturismul licitat este achitat integral, documentația de export este plătită integral, costul transportului din SUA în Germania este achitat integral și, după caz, este achitat costul înlocuirii certificatului title. Noi licităm în numele tău, fără supralicitări emoționale și fără a depăși valoarea reală a mașinii.
                    </p>
                    <p className="font-semibold text-primary">
                      Ne ocupăm de verificarea următorului autoturism pe care intenționezi să îl achiziționezi, fără costuri suplimentare.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transport Internațional */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <Ship className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Achiziție & Transport în SUA
& Transport Maritim către Europa
                    </h2>
                    <p className="text-sm text-accent font-medium">Sigur și asigurat</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      Dacă licitația este câștigată, firma de asigurări aprobă vânzarea, iar tu primești factura oficială pe numele tău.
                    </p>
                    <p>
                      Achiți vehiculul direct în SUA, prin transfer bancar. După confirmarea plății, noi ne ocupăm de transportul intern până în portul de plecare din SUA.

Organizăm transportul din portul american către portul Bremerhaven din Germania. Pe parcursul transportului, primești actualizări regulate privind poziția mașinii și estimarea de sosire.
                    </p>
                    <p className="font-semibold text-primary">
                      În această etapă ești informat permanent despre statusul vehiculului.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vamuire */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <FileText className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Transport Germania → România
                    </h2>
                    <p className="text-sm text-accent font-medium">Fără bătăi de cap</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      După sosirea în Bremerhaven, mașina intră în regim de tranzit și este pregătită pentru transportul rutier către România.
                    </p>
                    <p>
                      Ne ocupăm de reparația autoturismului, dacă acest lucru a fost agreat de la începutul procesului, precum și de omologarea R.A.R.
                    </p>
                    <p className="font-semibold text-primary">
                      Primești un proces clar, transparent și complet gestionat.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Livrare */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <Shield className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Livrare Finală & Opțional Reparație
                    </h2>
                    <p className="text-sm text-accent font-medium">La ușa ta</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      Mașina ajunge la tine fie prin livrare directă la adresă, fie prin ridicare personală.
                    </p>
                    <p>
                      Dacă dorești, putem coordona și partea de reparații împreună cu service-uri partenere din București. Singura condiție este acordul tău pentru filmarea procesului de reparație și publicarea lui pe YouTube.
                    </p>
                    <p className="font-semibold text-primary">
                      Nu percepem niciun comision suplimentar pentru supervizarea lucrării.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estimare Costuri */}
            <Card className="border-0 shadow-xl hover-lift bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <Calculator className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Estimare de Costuri Complet Transparentă
                    </h2>
                    <p className="text-sm text-accent font-medium">Transparență totală</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 text-muted-foreground">
                    <p>
                      Înainte de a începe procesul, îți oferim o estimare totală a costurilor implicate, de la prețul mașinii până la transport, taxe vamale, servicii de intermediere și documente necesare înmatriculării. Totul este explicat clar, astfel încât știi exact ce vei plăti. Fără surprize și fără costuri ascunse.
                    </p>
                    <p className="font-semibold text-primary mb-2">
                      Costurile includ:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Prețul mașinii la licitație + taxele platformei de licitație</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>După caz, înlocuirea „Salvage Title”, în regim de urgență</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Documentația de export</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Servicii de consultanță și intermediere</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Întocmirea documentelor pentru înmatriculare</span>
                      </li>
                    </ul>
                    <p className="font-semibold text-primary">
                      Fără surprize, fără taxe ascunse.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 bg-gradient-to-br from-primary via-primary to-slate-900 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            Servicii complete, transparență totală
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Ai toate serviciile necesare pentru un import reușit, gestionat profesional de la început până la final.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-xl h-16 px-12 btn-premium hover-glow shadow-2xl">
            <Link href="/contact">Solicită o Consultanță Gratuită</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
