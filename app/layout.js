import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "Rafal Chorazewicz",
  description:
    "Frontend developer in Stockholm. React, Next.js, TypeScript. Work: Sagobo, Job Hunter, Bury Meble, Frisör.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
