import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinPulse | Financial News Aggregator",
  description: "Automated Financial News Aggregator powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">
                FP
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                FinPulse
              </span>
            </div>
            <nav className="flex gap-4">
              <span className="text-sm font-medium text-muted hover:text-white transition-colors cursor-pointer">
                Markets
              </span>
              <span className="text-sm font-medium text-muted hover:text-white transition-colors cursor-pointer">
                Tech
              </span>
              <span className="text-sm font-medium text-muted hover:text-white transition-colors cursor-pointer">
                Economy
              </span>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-card-border py-8 mt-12 bg-card">
          <div className="container mx-auto px-4 text-center text-muted text-sm pb-8">
            &copy; {new Date().getFullYear()} FinPulse. Engineered for precision.
          </div>
        </footer>
      </body>
    </html>
  );
}
