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
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-sm font-medium text-gray-500 animate-pulse">
					Verifying session...
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
