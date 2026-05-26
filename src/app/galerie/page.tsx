import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Galerie Mașini Importate cu Succes",
  description: "Descoperă importuri reușite din SUA în România. Fiecare mașină are o poveste. Fiecare client are acum vehiculul pe care și l-a dorit.",
  openGraph: {
    title: "Galerie Mașini Importate cu Succes | MC SUA",
    description: "Descoperă importuri reușite din SUA în România. Fiecare mașină are o poveste.",
    images: ["/images/copart_winningbid1.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galerie Mașini Importate cu Succes | MC SUA",
    description: "Descoperă importuri reușite din SUA în România.",
  },
  alternates: {
    canonical: "https://mcsua.ro/galerie",
  },
};

export default function Galerie() {
  const cars = [
    {
      name: "Chevrolet Corvette C8",
      location: "România",
      image: "https://ugc.same-assets.com/XV_KXRTg-VjM0GTxvSXs-U8O-Hfu5pdj.jpeg"
    },
    {
      name: "Mercedes-Benz GLE",
      location: "România",
      image: "https://ugc.same-assets.com/llJlapw1TbxJ-HgO3B2mXeeQ2MJwEFTv.jpeg"
    },
    {
      name: "BMW Seria 4",
      location: "România",
      image: "https://ugc.same-assets.com/Ec0Skcm97SUCi73mMa0g_hPwWD9UX55L.jpeg"
    },
    {
      name: "Ford Mustang",
      location: "România",
      image: "https://ugc.same-assets.com/cHd2rm49PDUOqJr4SA1jz1xv2GPZpVuI.jpeg"
    },
    {
      name: "Maserati Ghibli",
      location: "România",
      image: "https://ugc.same-assets.com/J-vccynDYkzuqhhMoUEobkv9sE6ttQz7.jpeg"
    },
    {
      name: "Porsche Macan",
      location: "România",
      image: "https://ugc.same-assets.com/CyI3P2XCiDlmqyy3Y6Lg9GvzqPvaT7_L.jpeg"
    },
    {
      name: "Porsche Macan",
      location: "România",
      image: "https://ugc.same-assets.com/yz3QwCMWxy2JtROi2025kks99kkc76De.jpeg"
    },
    {
      name: "Audi RS5",
      location: "România",
      image: "https://ugc.same-assets.com/GydDj67Ae53O_xfN1WVksesbROiqPlC0.jpeg"
    },
    {
      name: "Audi Q5",
      location: "România",
      image: "https://ugc.same-assets.com/C7a-eI2sRnNSnhKR6juyqBBJoQAiI0cd.jpeg"
    },
    {
      name: "Audi A6",
      location: "România",
      image: "https://ugc.same-assets.com/RdoOTVANeqg7sQ91oUx_YSKXYnPl6LmE.jpeg"
    },
    {
      name: "BMW X7",
      location: "România",
      image: "https://ugc.same-assets.com/A8r-KcA9QR8YO1wpRPF235CV4eVoH4bq.jpeg"
    },
    {
      name: "Tesla",
      location: "România",
      image: "https://ugc.same-assets.com/aSv4H77BLZPDiK8vsFl_N0EfDUk_nhQt.jpeg"
    },
  ];

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
              Galeria Importurilor Noastre
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Fiecare mașină are o poveste. Fiecare client are acum vehiculul pe care și l-a dorit. Descoperă importuri reușite din SUA în România.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cars.map((car, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover-lift bg-white"
              >
                <div className="aspect-video overflow-hidden bg-slate-100 cinematic-overlay image-zoom-container">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover image-zoom"
                  />
                </div>
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {car.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-accent font-bold">Import complet</span>
                    <span className="text-muted-foreground font-medium">{car.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-2xl text-muted-foreground mb-8 font-medium">
              Următoarea mașină din galerie poate fi a ta.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white btn-premium text-lg h-14 px-10 hover-glow">
              <Link href="/contact">Începe Procesul</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-3xl bg-white shadow-lg hover-lift">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-4">500+</div>
              <p className="text-lg text-muted-foreground font-medium">Mașini importate cu succes</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-white shadow-lg hover-lift">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-4">100%</div>
              <p className="text-lg text-muted-foreground font-medium">Clienți mulțumiți</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-white shadow-lg hover-lift">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-4">8-10</div>
              <p className="text-lg text-muted-foreground font-medium">Săptămâni durată medie</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
