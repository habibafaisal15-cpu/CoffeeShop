import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brewed Coffee House — Admin",
  description: "Staff admin panel for Brewed Coffee House POS",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
