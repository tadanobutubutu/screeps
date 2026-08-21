import React from 'react';
import { useTable } from 'react-table';
import { Container, Table } from 'reactstrap';

// Main component
export default function Main() {
  // Define the columns for the table (26 columns total)
  const columns = [
    { Header: 'src/constants.js' },
    // ... (additional columns up to 26 total)
  ];

  // Accessibility improvements
  const heading = (id, text) => (
    <h2 id={id} aria-level={2}>
      {text}
    </h2>
  );

  const desc = (text) => (
    <p className="lead" aria-label="Description">
      {text}
    </p>
  );

  const tableTitle = heading('table-title', 'File Overview Table');
  const tableDesc = desc('The table below provides an overview of source code files.');
  const categoryHeading = (category) => heading(`category-${category}`, category);

  // Initialize the React Table hook
  const {
    getHeaderGroups,
    getRowProps,
    columns: allColumns,
    // other table utilities...
  } = useTable({ columns });

  return (
    <Container>
      <section aria-label="Metadata section">
        <>{tableTitle}</>
        <>{tableDesc}</>
      </section>
      <section aria-label="Categories section">
        {columns.map(({ Header: category }, idx) => (
          <>{categoryHeading(idx)}</>
        ))}
      </section>
      <section aria-label="Table section">
        <Table>
          {/* Remaining table structure */}
        </Table>
      </section>
    </Container>
  );
}

// Replace the non-interactive link with a button
export function RotateBackButton() {
  return (
    <button id="unrotate" aria-label="Rotate view back to original position" type="button">
      rotate back
    </button>
  );
}