import type { Metadata } from "next";
import "../../globals.css";
import { ToastProvider } from "@/components/ui/UseToast";

// Updated metadata for SEO
export const metadata: Metadata = {
    title: "UKCheckpoint Admin Dashboard - Commercial Vehicle Checkpoint Management",
    description: "A comprehensive solution for managing commercial vehicle checkpoints and planning efficient routes.",
    keywords: "commercial vehicles, checkpoints, route planning, logistics, vehicle tracking",
    authors: [{ name: "Zaid", url: "https://razan.vercel.com" }],
    openGraph: {
        title: "UKCheckpoint Admin Dashboard - Commercial Vehicle Checkpoint Management",
        description: "Manage commercial vehicle checkpoints efficiently and plan routes effectively.",
        url: "https://ukcheckpoint.info",
        images: [
            {
                url: "/assets/logo.jpg",
                width: 800,
                height: 600,
                alt: "UKCheckpoint App Screenshot",
            },
        ],
        siteName: "UKCheckpoint",
    },
    twitter: {
        card: "summary_large_image",
        title: "UKCheckpoint Admin Dashboard - Commercial Vehicle Checkpoint Management",
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
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
