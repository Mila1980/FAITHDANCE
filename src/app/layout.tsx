import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faith Dance | Private Dance Coaching",
  description: "Private dance coaching for confident movement, stronger technique, and performance readiness.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
