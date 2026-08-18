import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './main.js';

function updateTableHeaderScopes() {
	const headers = document.querySelectorAll('th:not([scope])');
	headers.forEach(header => {
		const isColumnHeader = header.closest('thead') !== null || header.parentElement.querySelectorAll('th').length > 1;
		header.setAttribute('scope', isColumnHeader ? 'col' : 'row');
	});
}

document.addEventListener('DOMContentLoaded', updateTableHeaderScopes);

hydrateRoot(
	document.documentElement.setAttribute('lang', 'en'),
	<React.StrictMode>
	  <App />
	</React.StrictMode>
);