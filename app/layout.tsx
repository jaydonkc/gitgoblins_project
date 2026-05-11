import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pet Adoption Match",
  description: "Swipe-style pet adoption MVP for GitGoblins.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
