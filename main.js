import { Html, Head, Main, NextScript } from 'next/document';  
export default function Document() {  
  return (  
    <Html lang="en">  
      <Head />  
      <body>  
        <header role="banner">  
          <nav role="navigation" aria-label="Main navigation">  
            <ul>  
              <li><a href="/">Home</a></li>  
              <li><a href="/about">About</a></li>  
            </ul>  
          </nav>  
        </header>  
        <Main />  
        <footer role="contentinfo">  
          <p>© 2024</p>  
        </footer>  
        <table>  
          <thead>  
            <tr>  
              <th scope="col">Column Header 1</th>  
              <th scope="col">Column Header 2</th>  
              <th scope="row">Row Header 1</th>  
              <th scope="row">Row Header 2</th>  
            </tr>  
          </thead>  
          <tbody>  
            {/* Add table rows as needed */}  
          </tbody>  
        </table>  
        <NextScript />  
      </body>  
    </Html>  
  );  
}