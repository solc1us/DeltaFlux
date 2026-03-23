import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex w-full min-h-screen">
			{/* Sidebar cuma muncul di grup dashboard */}
			<Sidebar />

			<main className="flex-1 p-8 md:p-12 overflow-y-auto">{children}</main>
		</div>
	);
}
