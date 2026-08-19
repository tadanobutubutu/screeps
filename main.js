function rotate(element, degrees) {
  element.style.transform = `rotate(${degrees}deg)`;
}

function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.type = 'button';
  button.addEventListener('click', () => {
    const target = document.getElementById('rotatable');
    if (target) {
      rotate(target, 0);
    }
  });
  return button;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useState, useRouter } from 'react';
import Table from 'react-bootstrap/Table';

const root = ReactDOM.createRoot(document.getElementById('root'));

function MyTable() {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com' },
    // More data rows...
  ]);

  const tableHeaders = Object.keys(data[0]);
  const tableRows = data.map((row) => (
    <tr key={row.id}>
      {tableHeaders.map((header) => (
        <Table.Cell key={`cell-${header}-${row.id}`}>{row[header]}</Table.Cell>
      ))}
    </tr>
  ));

  return (
    <div lang="en">
      <h1>Users List</h1>
      <Table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={`th-${header}`} aria-label={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </div>
  );
}

export function renderMainContent(content) {
  return (
    <main className="main-content">
      {content}
    </main>
  );
}

export const existingExport1 = () => {
  // existing implementation
};

export const existingExport2 = () => {
  // existing implementation
};

export const newFeature = () => {
  // implementation for new feature
};

export default function Main() {
  const router = useRouter();

  return (
    <>
      <h1>My Page</h1>
      <MyTable />
      {/* More components... */}

      {renderMainContent(
        <>
          {/* Component content here */}
        </>
      )}

      <footer id="footer">
        {/* Footer content here */}
      </footer>

      <nav aria-label="Main Navigation">
        <ul>
          {router.routes.map((route) => (
            <li key={route.id}>
              <a href={route.asPath}>{route.id}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

const container = document.getElementById('controls');
if (container) {
  container.appendChild(createUnrotateButton());
}