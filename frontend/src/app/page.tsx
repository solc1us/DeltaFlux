// src/app/page.tsx
"use client";

import Link from "next/link";
import { Variants, motion } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
	// Animation Variants
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.3,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: "easeOut", // Sekarang TS ngenalin ini sebagai valid Easing literal
			},
		},
	};

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#09090b] p-6 antialiased">
			{/* Background Grid Effect */}
			<div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

			{/* Hero Content */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 flex flex-col items-center text-center"
			>
				{/* Badge */}
				<motion.div
					variants={itemVariants}
					className="mb-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400"
				>
					<Zap className="h-3 w-3 text-amber-400" />
					Gen-Z Financial Tracking
				</motion.div>

				<motion.h1
					variants={itemVariants}
					className="text-6xl font-extrabold tracking-tighter text-zinc-100 md:text-8xl"
				>
					Delta<span className="text-zinc-500">Flux</span>
				</motion.h1>

				<motion.p
					variants={itemVariants}
					className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-500"
				>
					Master your cash flow with precision. Visualize trends, detect
					deviations, and achieve financial clarity with a high-performance
					interface designed for the modern era.
				</motion.p>

				<motion.div
					variants={itemVariants}
					className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
				>
					<Link
						href="/register"
						className="group flex items-center gap-2 rounded-xl bg-zinc-100 px-8 py-4 text-sm font-bold text-black transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
					>
						Get Started
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
					<Link
						href="/login"
						className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-sm font-bold text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-100"
					>
						Sign In
					</Link>
				</motion.div>

				{/* Floating Feature Icons (Subtle) */}
				<motion.div
					variants={itemVariants}
					className="mt-20 grid grid-cols-3 gap-8 border-t border-zinc-800/50 pt-12 text-zinc-600"
				>
					<div className="flex flex-col items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						<span className="text-[10px] font-bold uppercase tracking-widest">
							Analytics
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<ShieldCheck className="h-5 w-5" />
						<span className="text-[10px] font-bold uppercase tracking-widest">
							Secure
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Zap className="h-5 w-5" />
						<span className="text-[10px] font-bold uppercase tracking-widest">
							Fast
						</span>
					</div>
				</motion.div>
			</motion.div>

			{/* Decorative Glow */}
			<div className="absolute -top-[10%] left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-zinc-500/5 blur-[120px]" />
		</main>
	);
}
