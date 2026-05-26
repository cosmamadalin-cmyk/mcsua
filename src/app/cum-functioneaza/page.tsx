import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileCheck,
  Gavel,
  Ship,
  CheckCircle2,
  Wrench,
  Truck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cum Funcționează Procesul de Import Auto din SUA",
  description: "Procesul complet de import auto din SUA în România explicat pas cu pas. De la consultanță și licitație până la transport și livrare în România.",
  openGraph: {
    title: "Cum Funcționează Procesul de Import Auto din SUA | MC SUA",
    description: "Procesul complet de import auto din SUA în România explicat pas cu pas. De la consultanță și licitație până la transport și livrare în România.",
    images: ["/images/copart_winningbid1.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cum Funcționează Procesul de Import Auto din SUA | MC SUA",
    description: "Procesul complet de import auto din SUA în România explicat pas cu pas.",
    images: ["/images/copart_winningbid1.jpg"],
  },
  alternates: {
    canonical: "https://mcsua.ro/cum-functioneaza",
  },
};

export default function CumFunctioneaza() {
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
              Cum Funcționează Procesul de Import
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              O călătorie clară, pas cu pas — de la prima discuție până la livrarea mașinii. Fiecare etapă explicată simplu și transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Importul din SUA este avantajos în special pentru mașini care valorează cel puțin <strong className="text-primary">25.000 €</strong> pe piața europeană. În aceste cazuri, diferența finală poate ajunge la <strong className="text-accent">35–40%</strong> față de prețurile din România. <strong className="text-primary">Importăm doar la comandă</strong> — nu avem mașini pe stoc.
            </p>
          </div>
        </div>
      </section>

      {/* Pașii detaliați */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-20">

            {/* STEP 1 – Consultanță & Căutarea Mașinii */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    1
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Consultanță & Căutarea Mașinii
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-medium">Durată: 1-2 zile</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Totul începe cu o discuție sinceră. Ne spui ce îți dorești — tipul de mașină, marca, modelul, bugetul aproximativ și preferințele tale.
                  </p>
                  <p>
                    Împreună analizăm mașinile găsite de tine pe <a href="https://www.copart.com" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 transition-colors">Copart</a> și <a href="https://www.iaai.com" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 transition-colors">IAA</a>: verificăm tipul de daună, kilometrii și riscurile ascunse. Pe baza experienței noastre îți spunem dacă merită sau nu să mergem mai departe cu oferta.
                  </p>
                  <p>
                    Decizia finală rămâne la tine — noi te ghidăm, nu alegem în locul tău.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Consultanță gratuită și fără obligații
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Recomandări bazate pe experiență reală
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Estimare aproximativă a costurilor totale
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 1 Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/copart_winningbid1.jpg"
                  alt="Copart Winning Bid - Licitație câștigată"
                  width={800}
                  height={500}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* STEP 2 – Stabilirea Bugetului & Contractul de Intermediere */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="md:order-1">
                {/* Section 2 Image */}
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/contract2.jpg"
                    alt="Contract de intermediere MC SUA"
                    width={800}
                    height={500}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>

              <div className="md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    2
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Stabilirea Bugetului & Contractul de Intermediere
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <FileCheck className="h-5 w-5" />
                      <span className="font-medium">Durată: 1 zi</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Dacă mașina merită licitată, stabilim împreună suma maximă până la care licităm și se emite factura de garanție licitație.
                  </p>
                  <p>
                    În această etapă achiți un avans de <strong className="text-primary">10%</strong> din suma maximă de licitație. Acest avans este o garanție de licitație, folosită pentru taxele site-urilor și ca siguranță că vei achita integral prețul mașinii dacă licitația este câștigată. Garanția este facturată și returnată ulterior, după câștigarea mașinii și după ce sunt achitate taxele vamale (devamarea) în România, așa cum este prevăzut în contract.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Factură de garanție licitație
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Stabilirea sumei maxime de licitație
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Garanție de 10% facturată și returnabilă
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3 – Licitația, Câștigarea Mașinii & Returnarea Garanției */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    3
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Licitația, Câștigarea Mașinii & Returnarea Garanției
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <Gavel className="h-5 w-5" />
                      <span className="font-medium">Durată: 1-3 zile</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Participăm la licitație în numele tău, până la suma maximă agreată.
                  </p>
                  <p>
                    Dacă licitația este câștigată și aprobată, se semnează contractul de intermediere auto și emite factura de achiziție a auto direct pe numele proprietarului, emisa de firma noastră din SUA.
                  </p>
                  <p>
                    După ce autoturismul licitat este achitat integral, documentația de export este achitată integral, costul transportului din SUA în Germania este achitat integral și, după caz, este achitat costul înlocuirii certificatului title, garanția de 10% îți este returnată, conform contractului.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Confirmarea oficială că mașina a fost câștigată și garanția de 10% returnată
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Factură emisă în SUA pe numele tău
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Pași clari pentru plata internațională
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Contractul de intermediere auto
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3 Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/signed_contract3.jpg"
                  alt="Contract semnat - Licitație câștigată"
                  width={800}
                  height={500}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* STEP 4 – Preluarea Mașinii în SUA & Transportul Intern */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="md:order-1">
                {/* Section 4 Image */}
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/incarcare_rutier4.jpg"
                    alt="Încărcare mașină pe trailer - Transport intern SUA"
                    width={800}
                    height={500}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>

              <div className="md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    4
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Preluarea Mașinii în SUA & Transportul Intern
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <Truck className="h-5 w-5" />
                      <span className="font-medium">Durată: 5-10 zile</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    După confirmarea plății, mașina este preluată din depozitul licitației de către colaboratorul nostru rutier din SUA care livrează auto la portul de încărcare.
                  </p>
                  <p>
                    Se fac fotografii la ridicare și la încărcare, astfel încât să vezi starea mașinii imediat după licitație.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Organizarea preluării din licitație
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Transport intern până port în SUA
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Fotografii detaliate la ridicare și încărcare
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 5 – Încărcarea în Portul SUA & Transportul Maritim către Europa */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    5
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Încărcarea în Portul SUA & Transportul Maritim către Europa
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <Ship className="h-5 w-5" />
                      <span className="font-medium">Durată: 5-6 săptămâni</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Mașina ajunge în portul de export din SUA, unde este pregătită de plecare și încărcată în container sau pe navă.
                  </p>
                  <p>
                    Se emit documentele de shipping, iar tu primești detaliile de tracking însoțite de data estimată de plecare și de sosire în Europa.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Manipulare și pregătire de export în portul SUA
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Documente de transport maritim
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Estimare de timp pentru traversarea oceanului
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 5 Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/container_sua5.jpg"
                  alt="Container port SUA - Transport maritim"
                  width={800}
                  height={500}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* STEP 6 – Sosirea în Portul Bremerhaven (Germania), Tranzit & Depozitare */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="md:order-1">
                {/* Section 6 Image */}
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/debarcare_brem6.jpg"
                    alt="Debarcare port Bremerhaven Germania"
                    width={800}
                    height={500}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>

              <div className="md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    6
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Sosirea în Portul Bremerhaven (Germania), Tranzit & Depozitare
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <Ship className="h-5 w-5" />
                      <span className="font-medium">Durată: 3-7 zile</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    În această etapă nava ajunge în portul Bremerhaven din Germania, în această etapă se achită taxele de handling, taxele vamale și, după caz, TVA.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Descărcarea mașinii în Bremerhaven
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Fotografii realizate de brokerul vamal din Germania
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Plata manipulării, parcării și a garanției aferente
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Întocmirea documentelor de tranzit către România
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 7 – Transport Rutier Germania → România */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    7
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Transport Rutier Germania → România
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <Truck className="h-5 w-5" />
                      <span className="font-medium">Durată: 1-2 săptămâni</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    După finalizarea formalităților din Bremerhaven, un transportator rutier din Germania preia mașina pe platformă și o aduce în România. Costul mediu pentru acest transport este de aproximativ <strong className="text-primary">850 €</strong> per mașină (valoare orientativă, în funcție de rută și perioadă).
                  </p>
                  <p>
                    Transportatorul face poze la încărcare, astfel încât să vezi mașina înainte să plece spre țară.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Organizarea transportului pe platformă din Germania în România
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Fotografii la încărcare în Germania
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 7 Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/ruteier_germania7.jpg"
                  alt="Transport rutier Germania - România"
                  width={800}
                  height={500}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* STEP 8 – Livrare Finală & (Opțional) Reparație */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="md:order-1">
                {/* Section 8 Image */}
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/service8.jpg"
                    alt="Service auto - Reparații și livrare finală"
                    width={800}
                    height={500}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>

              <div className="md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-2xl">
                    8
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Livrare Finală & (Opțional) Reparație
                    </h2>
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <Wrench className="h-5 w-5" />
                      <span className="font-medium">Durată: variabilă</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Mașina poate fi livrată direct la adresa ta sau în unul dintre service-urile noastre partenere din București, pentru reparație.
                  </p>
                  <p>
                    Dacă alegi varianta de reparație prin noi, coordonăm lucrările fără comision suplimentar, cu condiția să avem acordul tău să filmăm procesul și să îl prezentăm pe YouTube, pentru transparență totală.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Ce primești în această etapă:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Livrare la adresa dorită sau la service partener
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Suport pentru reparații în service autorizat
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Coordonare și supervizare fără comision suplimentar
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        Predarea tuturor documentelor necesare înmatriculării
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

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
            Procesul e clar. Suntem cu tine la fiecare pas.
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Începe acum și descoperă cât de simplu poate fi să aduci mașina visurilor tale din America.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-xl h-16 px-12 btn-premium hover-glow shadow-2xl">
            <Link href="/contact">Începe Procesul</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
