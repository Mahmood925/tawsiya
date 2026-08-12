import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.tawsiya.trading",
  appName: "توصية",
  webDir: "public",
  server: {
    url: "https://tawsiya-oman.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
