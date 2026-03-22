"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Pakai useState supaya QueryClient gak ke-recreate tiap render
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 5, // Data dianggap fresh selama 5 menit
						retry: 1, // Gagal sekali, coba sekali lagi, baru error
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
