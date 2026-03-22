"use client";

import AuthGuard from "@/components/auth/auth-guard";

export default function DashboardPage() {
	return (
		<AuthGuard>
			<main className="p-8">
				<h1 className="text-2xl font-bold">Main Dashboard</h1>
				<p className="text-gray-600">Hanya user login yang bisa liat ini.</p>
			</main>
		</AuthGuard>
	);
}
