import React from 'react';
import ReactDOM from 'react-dom';

// Assuming that the primary content is defined in these components
import PrimaryContent from './PrimaryContent';
import Header from './Header';
import Footer from './Footer';

const App = () => (
  <div>
    <Header />
    <main>
      <PrimaryContent />
    </main>
    <Footer />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));