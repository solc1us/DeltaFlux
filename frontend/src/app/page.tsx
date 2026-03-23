// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center antialiased">
			<h1 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
				Delta<span className="text-gray-600">Flux</span>
			</h1>
			<p className="mt-6 max-w-lg text-lg text-gray-600">
				Analyze your personal finances with ease. Track expenses, visualize
				trends, and make informed decisions to achieve your financial goals. All
				in one place.
			</p>
			<div className="mt-10 flex gap-4">
				<Link
					href="/login"
					className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus:outline-none"
				>
					Login
				</Link>
				<Link
					href="/register"
					className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
				>
					Register
				</Link>
			</div>
		</main>
	);
}
