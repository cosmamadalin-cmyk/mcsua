import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">MC SUA</div>
            <p className="text-sm opacity-90 mb-2">
              Specialiștii tăi de încredere în intermedierea auto din SUA
            </p>
            <p className="text-xs opacity-75 font-bold mt-4 tracking-wide">
              LUXURY AUTO IMPORT SRL
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="https://www.instagram.com/auto_sua_auction/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram className="h-5 w-5 icon-hover" />
              </Link>
              <Link
                href="https://www.facebook.com/Importuri/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="h-5 w-5 icon-hover" />
              </Link>
              <Link
                href="https://www.youtube.com/@McSua-Auto-imports"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Youtube className="h-5 w-5 icon-hover" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigare</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Acasă
                </Link>
              </li>
              <li>
                <Link href="/cum-functioneaza" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Cum Funcționează
                </Link>
              </li>
              <li>
                <Link href="/servicii" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Servicii
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/politica-de-confidentialitate" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Politica de Confidențialitate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Servicii</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Consultanță Personalizată</li>
              <li>Verificare Vehicule</li>
              <li>Participare Licitații</li>
              <li>Transport Internațional</li>
              <li>Omologare R.A.R</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 group cursor-pointer">
                <Phone className="h-4 w-4 text-accent icon-hover" />
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">+40 764 806 987</span>
              </li>
              <li className="flex items-start gap-2 group cursor-pointer">
                <MapPin className="h-4 w-4 text-accent mt-1 icon-hover" />
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">București, România</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-sm text-center opacity-75">
          <p>&copy; {new Date().getFullYear()} MC SUA. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
