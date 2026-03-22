import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
// Kita bakal bikin komponen Sidebar ini sebentar lagi
import Sidebar from "@/components/layout/sidebar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "DeltaFlux - Personal Finance Analyzer",
	description: "Track your personal finances with absolute rigor.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full bg-gray-50 flex text-gray-900">
				<QueryProvider>
					{/* 1. Struktur Flexbox Utama */}
					<div className="flex w-full">
						{/* 2. Sidebar Komponen (Kiri) */}
						<Sidebar />

						{/* 3. Konten Utama (Kanan) */}
						<main className="flex-1 bg-gray-50 p-8 md:p-12">{children}</main>
					</div>
				</QueryProvider>
			</body>
		</html>
	);
}
