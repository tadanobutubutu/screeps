tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashboard for Screeps",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}

export const icons = {
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			aria-hidden="true"
		>
			<title>Screeps Dashboard</title>
			<text
				style={{
					fontFamily: "Arial",
					fontSize: "35px",
					fontWeight: "bold",
				}}
				y=".9em"
				x="50%"
				text-anchor="middle"
				fill="#fff"
			>
				D
			</text>
		</svg>
	),
};