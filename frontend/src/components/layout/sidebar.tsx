"use client";

import { useState } from "react"; // Tambahkan useState
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	LayoutDashboard,
	ReceiptText,
	BarChart3,
	Settings,
	LogOut,
	Menu, // Icon Hamburger
	X, // Icon Close
} from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/transaction", label: "Transaction", icon: ReceiptText },
	{ href: "/categories", label: "Categories", icon: BarChart3 },
	{ href: "/analytics", label: "Analytics", icon: BarChart3 },
	{ href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
	const [isOpen, setIsOpen] = useState(false); // State untuk buka/tutup
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem("token");
		router.replace("/login");
	};

	return (
		<>
			{/* 1. Hamburger Button (Hanya muncul di Mobile/kecil) */}
			<button
				onClick={() => setIsOpen(true)}
				className="fixed left-4 top-4 z-40 rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-400 md:hidden"
			>
				<Menu className="h-4 w-4" />
			</button>

			{/* 2. Backdrop (Klik di luar untuk menutup di mobile) */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* 3. Aside Component */}
			<aside
				className={clsx(
					// Base style tetap sama, tambahkan transition dan transform
					"fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-zinc-800/70 bg-zinc-950 p-6 shadow-2xl shadow-black/30 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0",
					isOpen ? "translate-x-0" : "-translate-x-full", // Logic buka tutup
				)}
			>
				{/* Tombol Close di dalam sidebar (hanya mobile) */}
				<button
					onClick={() => setIsOpen(false)}
					className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-100 md:hidden"
				>
					<X className="h-4 w-4" />
				</button>

				{/* 2. Logo */}
				<div className="mb-12 flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900 text-lg font-bold text-zinc-100">
						D
					</div>
					<h1 className="text-xl font-extrabold tracking-tight text-zinc-100">
						Delta<span className="text-zinc-500">Flux</span>
					</h1>
				</div>

				{/* 3. Main Navigation */}
				<nav className="flex-1 space-y-2">
					{navLinks.map((link) => {
						const Icon = link.icon;
						const isActive = pathname.startsWith(link.href);

						return (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsOpen(false)} // Tutup otomatis saat navigasi (mobile)
								className={clsx(
									"group flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200",
									isActive
										? "border-zinc-700 bg-zinc-900/90 text-zinc-100 shadow-lg shadow-black/20"
										: "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900/50 hover:text-zinc-200",
								)}
							>
								<Icon
									className={clsx(
										"h-5 w-5",
										isActive
											? "text-zinc-100"
											: "text-zinc-500 group-hover:text-zinc-300",
									)}
								/>
								{link.label}
							</Link>
						);
					})}
				</nav>

				{/* 4. Bottom Section (User/Logout) */}
				<div className="mt-6 border-t border-zinc-800/70 pt-6">
					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-sm font-medium text-rose-300 transition-all hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
					>
						<LogOut className="h-5 w-5 text-rose-400" />
						Logout
					</button>
				</div>
			</aside>
		</>
	);
}
