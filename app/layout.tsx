import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/data/site";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CommandPalette } from "@/components/CommandPalette";
import { AuroraBackground } from "@/components/AuroraBackground";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { BootSequence } from "@/components/BootSequence";

const siteUrl = "https://your-domain.example"; // TODO: replace after deploying — see SETUP_GUIDE.md

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  keywords: ["Cloud Engineer", "DevOps Engineer", "AWS", "Kubernetes", "Terraform", "Vishal Ranga"],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    url: siteUrl,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: siteUrl,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  sameAs: [site.GitHub, site.LinkedIn],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <AuroraBackground />
        <NoiseOverlay />
        <BootSequence />
        <ScrollProgress />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
