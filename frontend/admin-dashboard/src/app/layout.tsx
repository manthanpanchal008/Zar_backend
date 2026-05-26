import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zar jewels Admin",
  description: "Zar jewels Next.js admin dashboard",
  icons: {
    icon: "/icon-1.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
