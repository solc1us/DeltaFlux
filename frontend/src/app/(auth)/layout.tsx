import { Toaster } from "sonner";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[#09090b] p-4">
			<div className="w-full max-w-md">
				{children}
				<Toaster position="top-right" richColors />
			</div>
		</div>
	);
}
