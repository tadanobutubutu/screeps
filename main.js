// main.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        <Main />
        <footer role="contentinfo">
          <p>&copy; 2024 My Application</p>
        </footer>
        <NextScript />
      </body>
    </Html>
  );
}

export function AccessibleTable({ data }) {
  return (
    <table>
      <caption className="sr-only">Data summary table</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AccessibleIcon({ name, children }) {
  return (
    <span role="img" aria-label={name} aria-hidden="false">
      {children}
    </span>
  );
}

export function AccessibleLink({ href, children }) {
  return (
    <a href={href}>
      {children}
    </a>
  );
}