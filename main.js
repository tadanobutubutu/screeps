// File: /tests/main.test.js

import { render, screen } from '@testing-library/react';
import MainComponent from '../path/to/MainComponent'; // Adjust the path to your main component

describe('Accessibility Tests', () => {
  it('should not use the lang attribute incorrectly', () => {
    render(<MainComponent />);
    const langAttribute = screen.getByAttribute('lang');
    expect(langAttribute).toBeNull();
    // Alternatively, if you must use the lang attribute, ensure it's used correctly
    // expect(langAttribute).toHaveAttribute('lang', 'en');
  });
});