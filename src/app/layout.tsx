import type { Metadata } from "next";
import "./globals.css";

// Updated metadata for SEO
export const metadata: Metadata = {
  title: "UKcheckpoints - Commercial Vehicle Checkpoint Management",
  description: "A comprehensive solution for managing commercial vehicle checkpoints and planning efficient routes.",
  keywords: "commercial vehicles, checkpoints, route planning, logistics, vehicle tracking",
  authors: [{ name: "Zaid", url: "https://razan.vercel.com" }],
  openGraph: {
    title: "UKcheckpoints - Commercial Vehicle Checkpoint Management",
    description: "Manage commercial vehicle checkpoints efficiently and plan routes effectively.",
    url: "https://ukcheckpoint.info",
    images: [
      {
        url: "/images/your-image.jpg",
        width: 800,
        height: 600,
        alt: "UKcheckpoints App Screenshot",
      },
    ],
    siteName: "UKcheckpoints",
  },
  twitter: {
    card: "summary_large_image",
    title: "UKcheckpoints - Commercial Vehicle Checkpoint Management",
    description: "Manage commercial vehicle checkpoints efficiently and plan routes effectively.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
