"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
	children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
	const router = useRouter();
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem("token");

			if (!token) {
				// Lu nggak punya akses, balik ke login
				router.replace("/login");
			} else {
				// Token ada, silakan masuk
				setIsAuthorized(true);
			}
		};

		checkAuth();
	}, [router]);

	// Loading state supaya user nggak liat dashboard "pecah" sebelum redirect
	if (!isAuthorized) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#09090b] antialiased">
				<div className="flex flex-col items-center gap-4">
					{/* Subtle Pulse Loader */}
					<div className="h-1 w-24 overflow-hidden rounded-full bg-zinc-800">
						<div className="h-full w-full animate-pulse bg-zinc-600" />
					</div>
					<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
						Verifying session
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
