// Assuming the SVGs are being imported like this:
import logoSvg from './assets/logo.svg';
import metadataSvg from './assets/metadata.svg';

// And used in components like this:
import React from 'react';

const Logo = () => (
  <svg {...logoSvg.props} aria-label="Company Logo" />
);

const Metadata = () => (
  <svg {...metadataSvg.props} aria-label="Page Metadata" />
);

// The rest of your main.js code...

// Add this function to handle table headers with proper scope attributes
const TableHeader = ({ children, scope = 'col' }) => (
  <th scope={scope}>
    <div>{children}</div>
  </th>
);

// Example usage in your table components:
const DependencyTable = () => (
  <table>
    <thead>
      <tr>
        <TableHeader scope="col">File Path</TableHeader>
        <TableHeader scope="col">Dependencies</TableHeader>
      </tr>
    </thead>
    <tbody>
      {/* Table rows would go here */}
    </tbody>
  </table>
);