import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "توصية",
    short_name: "توصية",
    description: "شارك توصياتك وتحليلاتك بثقة",
    start_url: "/feed",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#B8863F",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
