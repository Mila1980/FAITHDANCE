import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.faithindance.com"),
  title: {
    default: "Online Dance Coach & Private Zoom Lessons | Faith.In.Dance.",
    template: "%s | Faith.In.Dance.",
  },
  description: "Private online dance lessons with Faith for stronger technique, confident movement, audition preparation, and personalized Zoom coaching.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Faith.In.Dance.",
    title: "Online Dance Coach & Private Zoom Lessons | Faith.In.Dance.",
    description: "Supportive private Zoom dance coaching for technique, confidence, auditions, and performance preparation.",
    url: "/",
    images: [{ url: "/images/faith-dance-pose.jpeg", alt: "Faith performing on stage" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Dance Coach & Private Zoom Lessons | Faith.In.Dance.",
    description: "Supportive private Zoom dance coaching for technique, confidence, auditions, and performance preparation.",
    images: ["/images/faith-dance-pose.jpeg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.faithindance.com/#website",
        url: "https://www.faithindance.com/",
        name: "Faith.In.Dance.",
        description: "Private online dance coaching and resources for dancers.",
      },
      {
        "@type": "Person",
        "@id": "https://www.faithindance.com/about#faith",
        name: "Faith",
        url: "https://www.faithindance.com/about",
        image: "https://www.faithindance.com/images/faith-about.jpg",
        jobTitle: "Dance Coach",
        knowsAbout: ["Dance technique", "Performance preparation", "Audition preparation", "Online dance coaching"],
      },
      {
        "@type": "Service",
        "@id": "https://www.faithindance.com/book#online-dance-lessons",
        name: "Private Online Dance Lessons",
        serviceType: "Private Zoom dance coaching",
        url: "https://www.faithindance.com/book",
        provider: { "@id": "https://www.faithindance.com/about#faith" },
        areaServed: "US",
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: "https://www.faithindance.com/book",
          availableLanguage: "English",
        },
      },
    ],
  };

  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />{children}</body></html>;
}
