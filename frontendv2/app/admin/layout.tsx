import RootLayout from "@/app/layout"; // Import the existing main layout
import { ReactNode } from "react";

export default function RootLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
