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
    <p className="lead">
      {text}
    </p>
  );

  const categoryHeading = (category) => (
    <h3 id={`category-${category.toLowerCase()}`}>{category}</h3>
  );

  // Initialize the React Table hook
  const {
    getHeaderGroups,
    getRowProps,
    columns: allColumns,
    // other table utilities...
  } = useTable({ columns });

  return (
    <div lang="en">
      <Container>
        <header role="banner" aria-label="Site header">
          <h1>Code Overview</h1>
        </header>
        <main role="main" aria-label="Main content">
          <section aria-label="Metadata section">
            {tableTitle}
            {tableDesc}
          </section>
          <section aria-label="Categories section">
            {columns.map(({ Header: category }, idx) => (
              <>{categoryHeading(category)}</>
            ))}
          </section>
          <section aria-label="Table section">
            <Table>
              <caption>The table below provides an overview of source code files.</caption>
              <thead>
                {getHeaderGroups().map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} scope="col">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {/* Remaining table structure */}
              </tbody>
            </Table>
          </section>
        </main>
        <footer role="contentinfo" aria-label="Site footer">
          <RotateBackButton />
        </footer>
      </Container>
    </div>
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