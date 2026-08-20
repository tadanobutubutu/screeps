// tests/docs/dependency-graph.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DependencyGraph from '../../../path/to/DependencyGraph'; // Adjust the path as needed

describe('DependencyGraph', () => {
  it('should not contain an anchor with a hash-only href', () => {
    render(<DependencyGraph />);
    expect(screen.queryByRole('link', { name: /rotate back/i })).toBeNull();
  });

  it('should contain a button for the rotate back action', () => {
    render(<DependencyGraph />);
    expect(screen.getByRole('button', { name: /rotate back/i })).toBeInTheDocument();
  });
});