import React from 'react';
import ReactDOM from 'react-dom/client';

const Main = () => {
  // New function to display a progress indicator
  const displayProgressIndicator = () => {
    return (
      <svg aria-label="Progress indicator">
        <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="none" />
        <circle cx="50" cy="50" r="30" stroke="blue" strokeWidth="3" fill="none" />
      </svg>
    );
  };

  return (
    <div lang="international">
      {/* Sample table with proper structure */}
      <table>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>

      {/* Accessible SVG */}
      <svg aria-label="Simple upward arrow icon representing progress">
        <path d="M0,0 L80,30 L50,60 L20,40 Z"/>
      </svg>

      {/* Unique landmark region */}
      <div id="main-content" role="main">Primary content area</div>

      {/* Fake link with descriptive label */}
      <a href="#top" aria-label="Navigate to top of page">Go to top</a>

      {/* New progress indicator */}
      {displayProgressIndicator()}
    </div>
  );
};

export default Main;