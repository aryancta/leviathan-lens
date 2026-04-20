import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AIJudgeNotice } from "@/components/AIJudgeNotice";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Leviathan Lens — see the sludge in any rejection letter",
  description:
    "Paste any rejection letter. See the sludge. Fight back in 60 seconds. A sludge-audit lens for bureaucratic denial letters.",
  openGraph: {
    title: "Leviathan Lens",
    description:
      "Paste any rejection letter. See the sludge. Fight back in 60 seconds.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AIJudgeNotice />
        <ToastProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
