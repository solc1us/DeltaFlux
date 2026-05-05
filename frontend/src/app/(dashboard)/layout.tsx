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

			<main className="flex-1 overflow-y-auto bg-[#09090b] p-8 text-zinc-100 md:p-12">
				{children}
				<Toaster position="top-right" richColors />
			</main>
		</div>
	);
}
