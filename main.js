/*
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
*/

import React from "react";

export default function MainPage() {
  return (
    <html lang="en">
      <body>
        <main aria-label="Main Content">
          <h1>Accessible Overview</h1>
          <nav aria-label="Primary Navigation">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
            </ul>
          </nav>
          <table>
            <caption>Example Data</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Item</td>
                <td>42</td>
              </tr>
            </tbody>
          </table>
          <svg
            aria-label="Logo"
            role="img"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <title>Logo</title>
            <circle cx="16" cy="16" r="14" />
          </svg>
          <button type="button" onClick={() => console.log("action")}>
            Action
          </button>
        </main>
      </body>
    </html>
  );
}