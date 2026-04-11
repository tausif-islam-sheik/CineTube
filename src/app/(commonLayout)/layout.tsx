"use client";

import { Navbar } from "@/components/layout/navbar";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">
        {children}
      </main>
    </>
  );
}
