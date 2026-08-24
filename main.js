const React = require('react');

// Existing exports
export function Export1() { ... }
export function Export2() { ... }

// Added functions to address accessibility issues

function AccessibleSVG({ svg }) {
  return (
    <svg
      aria-label="Your accessible name for the svg"
      {...svg}
    />
  );
}

function AccessibleTable({ header, body }) {
  return (
    <table>
      <thead>
        <tr>
          {header.forEach((headerCell) => (
            <th>{headerCell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, index) => (
          <tr key={index}>
            {row.map((cell, index) => (
              <td>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage examples
// Use AccessibleSVG for your existing svg components
const MySVGComponent = () => (
  <AccessibleSVG><path ... /></AccessibleSVG>
);

// Use AccessibleTable for your existing table components
const MyTableComponent = ({ header, body }) => (
  <AccessibleTable header={header} body={body} />
);