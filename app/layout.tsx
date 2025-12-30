import type { Metadata } from "next";

import { inter } from "@/app/ui/fonts"
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme Dashboard",
    default: 'Acme Dashboard'
  },
  description: "Next JS Course Dashboard, by Jun Dolor, built with App Router",
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
