import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                        rel="stylesheet"
                    />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
                    {/* Primary Meta Tags */}
                    <meta name="description" content="UKcheckpoints: Your trusted partner for efficient route planning and real-time checkpoint monitoring." />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="keywords" content="route planning, checkpoint monitoring, logistics, UK, real-time tracking, UKcheckpoints" />
                    <meta name="author" content="UKcheckpoints" />
                    <meta name="robots" content="index, follow" />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://www.ukcheckpoints.com" />
                    <meta property="og:title" content="UKcheckpoints - Route Planning & Real-Time Monitoring" />
                    <meta property="og:description" content="Efficient route planning with real-time checkpoint tracking for drivers and logistics companies." />
                    <meta property="og:image" content="https://www.ukcheckpoints.com/og-image.jpg" />

                    {/* Twitter */}
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://www.ukcheckpoints.com" />
                    <meta property="twitter:title" content="UKcheckpoints" />
                    <meta property="twitter:description" content="Your trusted partner for efficient route planning and real-time checkpoint monitoring." />
                    <meta property="twitter:image" content="https://www.ukcheckpoints.com/twitter-image.jpg" />

                    {/* Schema.org JSON-LD for structured data */}
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "UKcheckpoints",
                            url: "https://www.ukcheckpoints.com",
                            logo: "https://www.ukcheckpoints.com/logo.png",
                            sameAs: [
                                "https://www.facebook.com/UKcheckpoints",
                                "https://www.twitter.com/UKcheckpoints",
                                "https://www.instagram.com/UKcheckpoints",
                            ],
                        })}
                    </script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
