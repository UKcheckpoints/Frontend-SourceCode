"use client";

import { ThemeProvider } from 'next-themes'
import HeroSection from "@/components/layout/Hero";
import Chatbot from '@/components/layout/Chatbot';

export default function Home() {
  return (
    <header>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <HeroSection />
        <Chatbot />
      </ThemeProvider>
    </header>
  );
}
