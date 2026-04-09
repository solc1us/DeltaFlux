import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "DeltaFlux",
	description: "Personal Finance Analyzer",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark bg-[#09090b] text-zinc-100">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b]`}
			>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
