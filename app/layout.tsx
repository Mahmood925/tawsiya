import type { Metadata } from "next";
import { Almarai, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-almarai",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "توصية",
  description: "شارك توصياتك وتحليلاتك بثقة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${almarai.variable} ${ibmPlexSansArabic.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-ibm-plex), sans-serif",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
