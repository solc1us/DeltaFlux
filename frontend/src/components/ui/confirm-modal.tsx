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
			"bg-rose-600 hover:bg-rose-700 shadow-rose-200 disabled:bg-rose-400",
		primary: "bg-black hover:bg-gray-800 shadow-gray-200 disabled:bg-gray-400",
		warning:
			"bg-amber-600 hover:bg-amber-700 shadow-amber-200 disabled:bg-amber-400",
	};

	const iconClasses = {
		danger: "bg-rose-50 text-rose-600",
		primary: "bg-gray-50 text-gray-900",
		warning: "bg-amber-50 text-amber-600",
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
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
					<h3 className="text-lg font-bold text-gray-900 leading-tight">
						{title}
					</h3>
					<p className="text-sm text-gray-500 leading-relaxed">{description}</p>
				</div>

				<div className="flex gap-3 mt-8">
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all"
					>
						{cancelText}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className={clsx(
							"flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg shadow-lg transition-all",
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
