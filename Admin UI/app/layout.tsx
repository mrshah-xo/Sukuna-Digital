import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles/index.css";

export const metadata: Metadata = {
  title: "Premium Education Platform Design",
  description:
    "Delivers a premium digital education platform designed for schools to enhance learning, streamline management, and engage students effectively.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
