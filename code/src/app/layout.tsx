import "~/styles/globals.css";
import { Inter } from 'next/font/google'

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Comida Portuguesa Com Certeza",
  description: "",
  icons: [{ rel: "icon", url: "/faviconn.ico" }],
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'], // pesos que você quer
  variable: '--font-inter', // cria uma CSS variable
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br" className={`${inter.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
