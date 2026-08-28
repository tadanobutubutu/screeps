import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';

function App() {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to Our Site</h1>
        <p>This is a sample React application.</p>
        <Card title="Feature One" description="Description for feature one." />
        <Card title="Feature Two" description="Description for feature two." />
        <Card title="Feature Three" description="Description for feature three." />
      </main>
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Set the language attribute on the HTML element for accessibility
document.documentElement.lang = 'en';