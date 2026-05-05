"use client";

import { AlertTriangle } from "lucide-react";
import { clsx } from "clsx"; // Asumsi lo pake clsx buat dynamic classes

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "primary" | "warning";
	isLoading?: boolean;
}

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "danger",
	isLoading = false,
}: ConfirmModalProps) {
	if (!isOpen) return null;

	// Mapping variant ke styling tombol
	const variantClasses = {
		danger:
			"border border-rose-500/30 bg-rose-500/15 text-rose-200 hover:bg-rose-500/20 disabled:border-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-500",
		primary:
			"border border-zinc-700 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:border-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-500",
		warning:
			"border border-amber-500/30 bg-amber-500/15 text-amber-200 hover:bg-amber-500/20 disabled:border-zinc-800 disabled:bg-zinc-800 disabled:text-zinc-500",
	};

	const iconClasses = {
		danger: "border border-rose-500/30 bg-rose-500/10 text-rose-400",
		primary: "border border-zinc-700 bg-zinc-800/80 text-zinc-200",
		warning: "border border-amber-500/30 bg-amber-500/10 text-amber-400",
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
			<div className="animate-in fade-in zoom-in duration-200 w-full max-w-sm rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-2xl shadow-black/40">
				{/* Dynamic Icon Container based on Variant */}
				<div
					className={clsx(
						"flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto",
						iconClasses[variant],
					)}
				>
					<AlertTriangle className="w-6 h-6" />
				</div>

				<div className="text-center space-y-2">
					<h3 className="text-lg font-bold leading-tight text-zinc-100">
						{title}
					</h3>
					<p className="text-sm leading-relaxed text-zinc-500">{description}</p>
				</div>

				<div className="flex gap-3 mt-8">
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-800 disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-500"
					>
						{cancelText}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className={clsx(
							"flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
							variantClasses[variant],
						)}
					>
						{isLoading ? "Processing..." : confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
