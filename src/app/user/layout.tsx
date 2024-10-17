import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "UKcheckpoints - Route Planning & Real-Time Monitoring",
    description: "UKcheckpoints: Efficient route planning with real-time checkpoint tracking for drivers and logistics companies.",
    openGraph: {
        title: "UKcheckpoints - Route Planning & Real-Time Monitoring",
        description: "Efficient route planning with real-time checkpoint tracking for drivers and logistics companies.",
        url: "https://www.ukcheckpoints.com",
        type: "website",
        images: [
            {
                url: "https://www.ukcheckpoints.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "UKcheckpoints - Route Planning & Monitoring",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@UKcheckpoints",
        title: "UKcheckpoints",
        description: "Your trusted partner for efficient route planning and real-time checkpoint monitoring.",
    },
    alternates: {
        canonical: "https://www.ukcheckpoints.com",
        languages: {
            "en-GB": "https://www.ukcheckpoints.com/en-GB",
            "en-US": "https://www.ukcheckpoints.com/en-US",
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
