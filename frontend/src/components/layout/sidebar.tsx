"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	LayoutDashboard,
	ReceiptText,
	BarChart3,
	Settings,
	LogOut,
} from "lucide-react";
import { clsx } from "clsx";

// 1. Data Navigasi (Biar Scalable)
const navLinks = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/transaction", label: "Transaction", icon: ReceiptText },
	{ href: "/categories", label: "Categories", icon: BarChart3 },
	{ href: "/analytics", label: "Analytics", icon: BarChart3 },
	{ href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem("token"); // Hapus token
		router.replace("/login"); // Tendang ke login
	};

	return (
		<aside className="sticky top-0 h-screen w-64 flex flex-col border-r border-gray-100 bg-white p-6 shadow-sm">
			{/* 2. Logo */}
			<div className="mb-12 flex items-center gap-2">
				<div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-lg">
					D
				</div>
				<h1 className="text-xl font-extrabold tracking-tight text-gray-950">
					Delta<span className="text-gray-500">Flux</span>
				</h1>
			</div>

			{/* 3. Main Navigation */}
			<nav className="flex-1 space-y-2">
				{navLinks.map((link) => {
					const Icon = link.icon;
					// Cek apakah link ini aktif (Rigor Check)
					const isActive = pathname.startsWith(link.href);

					return (
						<Link
							key={link.href}
							href={link.href}
							className={clsx(
								"group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150",
								isActive
									? "bg-black text-white" // Style Aktif
									: "text-gray-600 hover:bg-gray-100 hover:text-gray-900", // Style Biasa
							)}
						>
							<Icon
								className={clsx(
									"w-5 h-5",
									isActive
										? "text-white"
										: "text-gray-400 group-hover:text-gray-600",
								)}
							/>
							{link.label}
						</Link>
					);
				})}
			</nav>

			{/* 4. Bottom Section (User/Logout) */}
			<div className="border-t border-gray-100 pt-6 mt-6">
				<button
					onClick={handleLogout}
					className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
				>
					<LogOut className="w-5 h-5 text-red-400" />
					Logout
				</button>
			</div>
		</aside>
	);
}
