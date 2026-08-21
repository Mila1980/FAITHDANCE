import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faith.In.Dance. | Private Zoom Dance Coaching",
  description: "Private Zoom dance coaching for confident movement, stronger technique, and performance readiness.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
