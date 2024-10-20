// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Google Fonts Poppins */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                        rel="stylesheet"
                    />

                    {/* SEO Meta Tags */}
                    <meta name="description" content="UKcheckpoints is a comprehensive commercial vehicle checkpoint management and route planning app for efficient logistics." />
                    <meta name="keywords" content="UKcheckpoints, commercial vehicle, route planning, checkpoint management, logistics" />
                    <meta name="author" content="Ben H" />
                    <meta name="robots" content="index, follow" />

                    {/* Open Graph Meta Tags */}
                    <meta property="og:title" content="UKcheckpoints - Efficient Checkpoint Management & Route Planning" />
                    <meta property="og:description" content="Discover UKcheckpoints, the ultimate solution for commercial vehicle checkpoint management and route planning." />
                    <meta property="og:image" content="https://example.com/image.jpg" />
                    <meta property="og:url" content="https://example.com" />
                    <meta property="og:type" content="website" />

                    {/* Twitter Card Meta Tags */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="UKcheckpoints - Efficient Checkpoint Management & Route Planning" />
                    <meta name="twitter:description" content="Explore UKcheckpoints for effective commercial vehicle management and optimized routing." />
                    <meta name="twitter:image" content="https://example.com/image.jpg" />

                    {/* Favicon */}
                    <link rel="icon" href="/favicon.ico" />

                    {/* HERE Maps CSS */}
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href="https://js.api.here.com/v3/3.1/mapsjs-ui.css"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />

                    {/* HERE Maps Scripts */}
                    <Script
                        src="https://js.api.here.com/v3/3.1/mapsjs-core.js"
                        strategy="beforeInteractive"
                    />
                    <Script
                        src="https://js.api.here.com/v3/3.1/mapsjs-service.js"
                        strategy="beforeInteractive"
                    />
                    <Script
                        src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"
                        strategy="beforeInteractive"
                    />
                    <Script
                        src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"
                        strategy="beforeInteractive"
                    />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
