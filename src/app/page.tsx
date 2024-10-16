"use client";

import { ThemeProvider } from 'next-themes'
import HeroSection from "@/components/layout/Hero";

export default function Home() {
  return (
    <header>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <HeroSection />
      </ThemeProvider>
    </header>
  );
}
