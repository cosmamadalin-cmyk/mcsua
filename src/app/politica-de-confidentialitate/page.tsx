import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Shield, FileText, Lock, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate",
  description: "Protejarea datelor tale personale este o prioritate pentru noi. Află cum colectăm, folosim și protejăm informațiile tale personale.",
  openGraph: {
    title: "Politica de Confidențialitate | MC SUA",
    description: "Protejarea datelor tale personale este o prioritate pentru noi.",
  },
  twitter: {
    card: "summary",
    title: "Politica de Confidențialitate | MC SUA",
    description: "Protejarea datelor tale personale este o prioritate pentru noi.",
  },
  alternates: {
    canonical: "https://mcsua.ro/politica-de-confidentialitate",
  },
};

export default function PoliticaDeConfidentialitate() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex p-4 bg-accent/10 rounded-full mb-6">
              <Shield className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Politica de Confidențialitate
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Protejarea datelor tale personale este o prioritate pentru noi.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Introducere */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
                <FileText className="h-7 w-7 text-accent" />
                Introducere
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                LUXURY AUTO IMPORT SRL, operând sub brandul MC SUA, se angajează să protejeze
                confidențialitatea și securitatea datelor personale ale utilizatorilor site-ului nostru.
                Această politică descrie modul în care colectăm, folosim și protejăm informațiile dvs. personale.
              </p>
            </div>

            {/* Ce date colectăm */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
                <UserCheck className="h-7 w-7 text-accent" />
                Ce date colectăm și de ce
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Colectăm doar datele necesare pentru a vă oferi serviciile noastre de intermediere auto:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Date de identificare:</strong> nume, prenume, adresă de email, număr de telefon</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Date de comunicare:</strong> mesajele trimise prin formularul de contact</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Date tehnice:</strong> adresa IP, tipul browserului, pentru funcționarea site-ului</span>
                </li>
              </ul>
            </div>

            {/* Baza legală */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Baza legală pentru prelucrare
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Prelucrăm datele dvs. personale în baza următoarelor temeiuri legale:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Consimțământul:</strong> pentru trimiterea de comunicări comerciale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Executarea contractului:</strong> pentru furnizarea serviciilor solicitate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Interesul legitim:</strong> pentru îmbunătățirea serviciilor și securitatea site-ului</span>
                </li>
              </ul>
            </div>

            {/* Formulare de contact */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Formulare de contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Când utilizați formularul de contact, datele furnizate (nume, email, telefon, mesaj)
                sunt folosite exclusiv pentru a răspunde solicitării dvs. și pentru a vă oferi
                consultanță privind serviciile noastre de import auto.
              </p>
            </div>

            {/* Păstrarea datelor */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Păstrarea datelor
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Păstrăm datele dvs. personale doar atât timp cât este necesar pentru scopurile
                pentru care au fost colectate sau conform cerințelor legale aplicabile.
                Datele din formularele de contact sunt păstrate pentru o perioadă de maximum 3 ani
                de la ultima interacțiune.
              </p>
            </div>

            {/* Partajarea datelor */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Partajarea datelor
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nu vindem, nu închiriem și nu partajăm datele dvs. personale cu terțe părți,
                cu excepția cazurilor în care:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>Este necesar pentru furnizarea serviciilor (ex: parteneri de transport)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>Suntem obligați legal să dezvăluim informațiile</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>Aveți consimțământul explicit pentru partajare</span>
                </li>
              </ul>
            </div>

            {/* Drepturile utilizatorului */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
                <Lock className="h-7 w-7 text-accent" />
                Drepturile utilizatorului
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Conform Regulamentului General privind Protecția Datelor (GDPR), aveți următoarele drepturi:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Dreptul de acces:</strong> să solicitați o copie a datelor personale pe care le deținem</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Dreptul la rectificare:</strong> să solicitați corectarea datelor inexacte</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Dreptul la ștergere:</strong> să solicitați ștergerea datelor personale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Dreptul la restricționare:</strong> să solicitați limitarea prelucrării</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Dreptul la portabilitate:</strong> să primiți datele într-un format structurat</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Dreptul de opoziție:</strong> să vă opuneți prelucrării datelor</span>
                </li>
              </ul>
            </div>

            {/* Cookie-uri */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Cookie-uri
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Site-ul nostru utilizează cookie-uri pentru a asigura funcționarea corectă și
                pentru a îmbunătăți experiența utilizatorilor. Cookie-urile sunt fișiere text
                mici stocate pe dispozitivul dvs. care ne ajută să înțelegem cum este utilizat
                site-ul nostru.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Puteți configura browserul pentru a refuza cookie-urile, însă acest lucru poate
                afecta funcționalitatea site-ului.
              </p>
            </div>

            {/* Securitatea datelor */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Securitatea datelor
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele
                dvs. personale împotriva accesului neautorizat, pierderii sau distrugerii.
                Site-ul nostru utilizează criptare SSL pentru a proteja transmisia datelor.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4 bg-slate-50 p-8 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Pentru orice întrebări sau solicitări privind datele dvs. personale,
                ne puteți contacta la:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-accent" />
                  <span className="font-medium">+40 764 806 987</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 text-accent" />
                  <span className="font-medium">luxuryautoimport@mcsua.ro</span>
                </div>
              </div>
            </div>

            {/* Data validitate */}
            <div className="text-center pt-8 border-t border-slate-200">
              <p className="text-sm text-muted-foreground">
                Această politică este valabilă începând cu 11.01.2026.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white">
                <Link href="/contact">Contactează-ne</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
