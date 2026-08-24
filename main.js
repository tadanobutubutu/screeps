import type { Metadata } from 'next';
import '../styles/globals.css';
import React from 'react';
import { Providers } from './providers';
import type { LayoutComponent } from './layout.d';

const metadata: Metadata = {
	icons: {
		icon: '/icon.svg',
	},
};

const LayoutComponent: LayoutComponent = ({ children }) => (
	<html lang="en">
		<head>
			<title>Screeps Dashboard</title>
			<meta name="description" content="Dashboard for Screeps" />
			<link rel="icon" href="/icon.svg" type="image/svg+xml" />
		</head>
		<body>
			<Providers>{children}</Providers>
		</body>
	</html>
);

export { metadata };

export default LayoutComponent;