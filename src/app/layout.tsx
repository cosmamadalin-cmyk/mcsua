import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://mcsua.ro";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MC SUA - Import Auto din SUA în România",
    template: "%s | MC SUA",
  },
  description: "Calea sigură către mașina ta din America. Consultanță, verificare, licitație, transport și livrare completă în România. Import auto profesionist din SUA.",
  keywords: ["import auto SUA", "mașini din America", "licitații auto Copart", "licitații IAAI", "transport auto SUA România", "import auto România"],
  authors: [{ name: "MC SUA - LUXURY AUTO IMPORT SRL" }],
  creator: "MC SUA",
  publisher: "LUXURY AUTO IMPORT SRL",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: siteUrl,
    siteName: "MC SUA",
    title: "MC SUA - Import Auto din SUA în România",
    description: "Calea sigură către mașina ta din America. Consultanță, verificare, licitație, transport și livrare completă în România.",
    images: [
      {
        url: "/images/copart_winningbid1.jpg",
        width: 1200,
        height: 630,
        alt: "MC SUA - Import Auto din SUA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MC SUA - Import Auto din SUA în România",
    description: "Calea sigură către mașina ta din America. Consultanță, verificare, licitație, transport și livrare completă în România.",
    images: ["/images/copart_winningbid1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add Google Search Console verification if available
    // google: "verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        {/* JSON-LD Schema for LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoBroker",
              "name": "MC SUA",
              "legalName": "LUXURY AUTO IMPORT SRL",
              "description": "Servicii de intermediere și import auto din SUA în România. Consultanță, licitații, transport și livrare completă.",
              "url": siteUrl,
              "telephone": "+40764806987",
              "email": "luxuryautoimport@mcsua.ro",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "București",
                "addressCountry": "RO"
              },
              "areaServed": {
                "@type": "Country",
                "name": "România"
              },
              "serviceType": ["Import auto", "Intermediere licitații auto", "Transport auto internațional"],
              "priceRange": "€€€",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.instagram.com/auto_sua_auction/",
                "https://www.facebook.com/Importuri/",
                "https://www.youtube.com/@McSua-Auto-imports"
              ]
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Navigation />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
