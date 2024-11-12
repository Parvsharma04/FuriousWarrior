import RootLayout from "@/app/layout"; // Import the existing main layout
import { ReactNode } from "react";

export default function RootLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RootLayout>
      <main className="min-h-screen">{children}</main>
    </RootLayout>
  );
}
