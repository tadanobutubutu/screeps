import { getByTestId, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import YourComponent from '../YourComponent';

test('Language attribute is present', () => {
  const { container } = render(<YourComponent />);
  const htmlElement = getByTestId(container, 'html-element');
  expect(htmlElement).toHaveAttribute('lang', 'en'); // Replace 'en' with your default language
});