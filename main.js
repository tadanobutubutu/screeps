import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DependencyGraph from './components/DependencyGraph';
import HomePageContent from './components/HomePageContent';

function App() {
  return (
    <div>
      <Header />
      {/* Existing content that does not wrap the primary content in a <main> */}
      <DependencyGraph />
      <HomePageContent />
      <Footer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));