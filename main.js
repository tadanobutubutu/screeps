// optionally merge all changes, ripple effects may occur while testing
// or choose the 'git checkout --theirs' command to keep all changes in main.js
import Head from 'next/head';

export default function Main() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* REACT_017: Ensure proper landmarks */}
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      
      {/* REACT_017 & REACT_025: Main landmark (one per page) */}
      <main id="main-content">
        <h1>Welcome to Our Site</h1>
        
        {/* REACT_036: Use proper semantic elements */}
        {/* Bad: <div onClick={handleClick}>Click me</div> */}
        <button type="button" onClick={() => console.log('clicked')}>
          Submit Form
        </button>
        
        {/* REACT_036: Use button for in-page actions (formerly fake link) */}
        <button id="unrotate" type="button" onClick={() => console.log('rotate back clicked')}>
          rotate back
        </button>
        
        {/* REACT_041: SVG with accessible name */}
        <svg 
          aria-labelledby="close-dialog-title"
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
        >
          <title id="close-dialog-title">Close dialog</title>
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
        </svg>
        
        {/* REACT_027: Proper table structure */}
        <table>
          <caption>Pricing Plans</caption>
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">Price</th>
              <th scope="col">Support</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Basic</th>
              <td>$9.99</td>
              <td>Standard support</td>
            </tr>
            <tr>
              <th scope="row">Pro</th>
              <td>$19.99</td>
              <td>Priority support</td>
            </tr>
          </tbody>
        </table>
      </main>
      
      {/* REACT_017 & REACT_025: Footer landmark */}
      <footer aria-label="Site footer">
        <nav aria-label="Footer navigation">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </nav>
      </footer>
    </>
  );
}