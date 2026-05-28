import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zar jewels Admin",
  description: "Zar jewels Next.js admin dashboard",
  icons: {
    icon: "/Zar_backend/icon-1.png",
    shortcut: "/Zar_backend/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#1c1917",
                border: "1px solid #eee7dd",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
