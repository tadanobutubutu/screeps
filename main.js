import React from 'react';
import ReactDOM from 'react-dom/client';

function Demo() {
  const handleClick = () => console.log('clicked');
  return (
    <main id="demo-main">
      <h1>Accessibility Demo</h1>
      <p>This page demonstrates fixed accessibility issues.</p>
      <button onClick={handleClick} data-testid="increment-button">Increment</button>
      <table>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple</td>
            <td>5</td>
          </tr>
          <tr>
            <td>Banana</td>
            <td>3</td>
          </tr>
        </tbody>
      </table>
      <svg width="50" height="50" viewBox="0 0 50 50" aria-label="Simple circle">
        <circle cx="25" cy="25" r="15" stroke="black" strokeWidth="2" fill="none"/>
      </svg>
      <a href="/about" data-testid="link">About</a>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Demo />);