// utils.js
export function replaceHashLinksWithButtons() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    const button = document.createElement('button');
    button.innerHTML = link.innerHTML;
    link.parentNode.replaceChild(button, link);
  });
}

// test.js
import { replaceHashLinksWithButtons } from './utils';

describe('replaceHashLinksWithButtons', () => {
  it('should replace href="#" links with buttons', () => {
    // Setup a mock document body
    document.body.innerHTML = `
      <a id="unrotate" href="#">rotate back</a>
      <div>Other content</div>
    `;

    // Run the utility function
    replaceHashLinksWithButtons();

    // Assertions to check that the links have been replaced
    expect(document.querySelector('a')).toBeNull();
    expect(document.querySelector('button')).not.toBeNull();
    expect(document.querySelector('button').textContent).toBe('rotate back');
  });
});