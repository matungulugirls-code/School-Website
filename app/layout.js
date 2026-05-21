import localFont from "next/font/local";
import "./globals.css";
import ClientLayoutWrapper from "./-app";
import { SessionProvider } from "./session/sessiowrapper";

/* -------------------------------------------------------------------------- */
/* FONTS                                    */
/* -------------------------------------------------------------------------- */
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/* -------------------------------------------------------------------------- */
/* VIEWPORT                                  */
/* -------------------------------------------------------------------------- */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c", // Matches your orange-600 brand color
};

/* -------------------------------------------------------------------------- */
/* METADATA                                  */
/* -------------------------------------------------------------------------- */
export const metadata = {
  metadataBase: new URL("https://matungulugirls.school"),

  title: {
    default: "Matungulu Girls School",
    template: "%s | Matungulu Girls Senior School",
  },

  description:
    "Official Matungulu Girls Website - Premier Public Secondary School in Machakos County, Kenya. Excellence in academics, sports, and character development.",
  keywords: [
    /* Primary Keywords */
    "Matungulu Girls Senior School",
    "Matungulu Girls Secondary School",
    "Matungulu Girls High School",
    "Matungulu Girls School",
    "MatG School",
    "Matungulu National School",
    
    /* Search Engine Names & Variants */
    "Matungulu Girls Official Website",
    "Matungulu Girls School Kenya",
    "Matungulu Girls School Machakos",
    "Matungulu Girls School Machakos County",
    "Matungulu Girls Extra County School",
    
    /* Academic Performance */
    "Matungulu Girls KCSE Results",
    "Matungulu Girls KCSE Performance",
    "Matungulu Girls Mean Score",
    "Matungulu Girls University Placement",
    "Matungulu Girls Rankings",
    "Top Girls Schools Machakos",
    "Best Secondary Schools Machakos County",
    
    /* Admissions & Information */
    "Matungulu Girls Admission",
    "Matungulu Girls Admissions Letter",
    "Matungulu Girls Joining Instructions",
    "Matungulu Girls Form One Selection",
    "Matungulu Girls Fees Structure",
    "Matungulu Girls School Fees",
    "Matungulu Girls Uniform",
    
    /* Contact & Location */
    "Matungulu Girls Phone Number",
    "Matungulu Girls Email Address",
    "Matungulu Girls Direction",
    "Matungulu Girls Location",
    "Matungulu Girls Map",
    "Matungulu Town Machakos",
    
    /* School Information */
    "Matungulu Girls Principal",
    "Matungulu Girls History",
    "Matungulu Girls Achievements",
    "Matungulu Girls Curriculum",
    "Matungulu Girls Events",
    "Matungulu Girls News",
    "Matungulu Girls Alumni",
    "Matungulu Girls Old Girls Association",
    
    /* Related Keywords */
    "Girls Boarding Schools Machakos",
    "Public Schools Kenya",
    "KUCCPS Matungulu Girls",
    "Machakos County Schools",
    "Secondary School Portal Kenya",
    "KCSE Results Kenya",
    
    /* Brand Variations */
    "MatG Senior School",
    "Mat G School",
    "mat g official website",
    "Matungulu girls official website",
    "Matungulu Girls Senior High School",
  ],
  
  authors: [{ name: "Matungulu Girls School" }],

  /* Open Graph (Social Media Sharing - WhatsApp, Facebook, etc.) */
  openGraph: {
    title: "Matungulu Girls School - Official Website",
    description: "Official Matungulu Girls Website.",
    url: "https://matungulugirls.school",
    siteName: "Matungulu Girls Senior School",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/MatG.jpg",
        width: 1200,
        height: 630,
        alt: "Matungulu Girls School - Official Website",
        type: "image/jpeg",
      },
      {
        url: "https://matungulugirls.school/MatG.jpg",
        width: 1200,
        height: 630,
        alt: "Matungulu Girls School ",
        type: "image/jpeg",
      },
    ],
  },

  /* Twitter Card */
  twitter: {
    card: "summary_large_image",
    site: "@MatunguluGirls",
    title: "Matungulu Girls Senior School - Official Website",
    description: "Official Matungulu Girls Website.",
    images: [
      {
        url: "https://matungulugirls.school/MatG.jpg",
        alt: "Matungulu Girls School",
      },
    ],
    creator: "@MatunguluGirls",
  },

  /* Search Engine Bot Instructions */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* Alternate Links for Search Engines */
  alternates: {
    canonical: "https://matungulugirls.school",
    languages: {
      'en-KE': "https://matungulugirls.school",
      'en': "https://matungulugirls.school",
    },
  },

  icons: {
    icon: "/MatG.jpg",
    apple: "/MatG.jpg",
  },

  verification: {
    google: "googleaca91d683d907aa4",
  },
};

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                 */
/* -------------------------------------------------------------------------- */
export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for Local Business/School SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "Matungulu Girls School",
    "alternateName": "Matungulu Girls Senior School",
    "url": "https://matungulugirls.school",
    "logo": "https://matungulugirls.school/MatG.jpg",
    "image": "https://matungulugirls.school/MatG.jpg",
    "description": "A premier public girls school in Matungulu, Machakos County, Kenya.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Matungulu",
      "addressRegion": "Machakos County",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-1.2825", // Optional: replace with your actual GPS coordinates
      "longitude": "37.2618"
    },
    "hasMap": "https://www.google.com/maps?q=matungulu+girls+School", 
    "telephone": "0734610130",
    "priceRange": "N/A"
  };

  return (
    <html lang="en">
      <head>
        {/* Injecting Structured Data into the Head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-900`}
      >
        <SessionProvider>
          <ClientLayoutWrapper>
            {/* Semantic <main> tag should wrap content in page.jsx files for SEO */}
            {children}
          </ClientLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
