/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import App from './main';

// Mock the components that might not be fully implemented
jest.mock('./components/Header', () => () => <header>Mock Header</header>);
jest.mock('./components/Footer', () => () => <footer>Mock Footer</footer>);
jest.mock('./components/ProductList', () => () => <div>Mock Product List</div>);

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders the main layout', () => {
    const { container } = render(<App />);
    expect(container.querySelector('header')).toBeTruthy();
    expect(container.querySelector('footer')).toBeTruthy();
    expect(container.querySelector('[data-testid="product-list"]')).toBeTruthy();
  });
});

const App = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <h1>Welcome to Our Store</h1>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
};

export default App;