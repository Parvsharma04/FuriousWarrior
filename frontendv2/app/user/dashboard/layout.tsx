// app/root/layout.tsx
import RootLayout from "@/app/layout"; // Import the existing main layout
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default function RootLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RootLayout>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </RootLayout>
  );
}
