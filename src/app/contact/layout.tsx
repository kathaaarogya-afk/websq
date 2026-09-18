// app/about/layout.tsx
import type React from "react";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  // Only wrap children, do NOT include Header/Footer/Chatbot
  return <>{children}</>;
}