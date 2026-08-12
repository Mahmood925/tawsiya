import { NextResponse } from "next/server";

const SW_SOURCE = `
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { link: data.link || "/feed" },
      dir: "rtl",
      lang: "ar",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data && event.notification.data.link ? event.notification.data.link : "/feed";
  event.waitUntil(clients.openWindow(link));
});
`;

export function GET() {
  return new NextResponse(SW_SOURCE, {
    headers: {
      "Content-Type": "application/javascript",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-cache",
    },
  });
}
