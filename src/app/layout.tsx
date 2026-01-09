import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
    title: "AI Prescription Reader",
    description: "AI-Driven Handwritten Prescription Analysis - Transform doctor handwriting into structured, searchable medical data",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div className="flex min-h-screen bg-[var(--bg-main)]">
                    <Sidebar />
                    <main className="flex-1 ml-20 p-8 overflow-hidden h-screen">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
