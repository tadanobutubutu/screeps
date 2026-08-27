import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppLayout } from 'path/to/AppLayout'; // adjust as needed
import { Container, Favicon } from 'path/to/Components'; // adjust as needed

describe('Accessibility', () => {
  test('Favicon has accessibleName', () => {
    render(<Favicon />);
    const faviconElement = screen.getByRole('img', {
      name: /Screeps Dashboard/i,
    });
    expect(faviconElement).toBeInTheDocument();
  });
});