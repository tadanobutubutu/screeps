// main.js - Next.js page with accessibility fixes applied

import '../styles/globals.css';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Our Site</h1>
      <nav aria-label="Main navigation">
        <a href="/about">About Us</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
      </nav>
      
      <main>
        <section aria-labelledby="intro-heading">
          <h2 id="intro-heading">Introduction</h2>
          <p>Welcome to our accessibility-friendly website.</p>
        </section>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading">Features</h2>
          <table>
            <caption>Pricing tiers and features</caption>
            <thead>
              <tr>
                <th scope="col">Tier</th>
                <th scope="col">Price</th>
                <th scope="col">Features</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic</td>
                <td>$9/mo</td>
                <td>Core features</td>
              </tr>
              <tr>
                <td>Pro</td>
                <td>$19/mo</td>
                <td>All basic + advanced features</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Contact Us</h2>
          <button type="button" onClick={() => console.log('clicked')}>
            Send Message
          </button>
        </section>
      </main>

      <footer>
        <p>© 2024 Our Company</p>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          aria-label="Social media icon" 
          role="img"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      </footer>
    </div>
  );
}