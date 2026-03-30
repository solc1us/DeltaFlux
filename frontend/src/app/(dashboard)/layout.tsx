import Sidebar from "@/components/layout/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex w-full min-h-screen">
			{/* Sidebar cuma muncul di grup dashboard */}
			<Sidebar />

			<main className="flex-1 p-8 md:p-12 overflow-y-auto">
				{children}
				<Toaster position="top-right" richColors />
			</main>
		</div>
	);
}
