import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroVision",
  description:
    "AgroVision is a web application that provides weather data and insights for farmers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${manrope.className} `}>
          <Toaster closeButton richColors={true} position={"top-right"} />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
