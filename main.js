// src/main.js
const dom = require('./dom');
const events = require('./events');
const utils = require('./utils');

/**
 * Main entry point for the application.
 * Handles initialization and event binding for core functionality.
 */
class Main {
  /**
   * Initializes the application.
   * @returns {void}
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.setInitialAriaAttributes();
  }

  /**
   * Caches DOM elements for reuse.
   * @private
   * @returns {void}
   */
  cacheElements() {
    this.$container = document.querySelector('#app-container');
    this.$buttons = this.$container.querySelectorAll('button');
    this.$inputs = this.$container.querySelectorAll('input, textarea, select');
  }

  /**
   * Binds event listeners for user interactions.
   * @private
   * @returns {void}
   */
  bindEvents() {
    this.$buttons.forEach((btn) => {
      events.on(btn, 'click', this.handleButtonClick.bind(this));
      events.on(btn, 'keydown', this.handleButtonKeyDown.bind(this));
    });

    this.$inputs.forEach((input) => {
      events.on(input, 'focus', this.handleInputFocus.bind(this));
      events.on(input, 'blur', this.handleInputBlur.bind(this));
    });
  }

  /**
   * Handles button click events.
   * Provides accessible feedback and prevents default actions when needed.
   * @param {Event} event - The click event object.
   * @private
   * @returns {void}
   */
  handleButtonClick(event) {
    const $btn = event.currentTarget;

    // Provide screen reader announcement.
    const announcement = $btn.getAttribute('aria-label') || $btn.textContent.trim();
    dom.announceToScreenReader(`Button clicked: ${announcement}`);

    // Optionally prevent default if the button has a data attribute.
    if ($btn.hasAttribute('data-prevent-default')) {
      event.preventDefault();
    }
  }

  /**
   * Handles button keyboard events for accessibility.
   * Ensures Enter and Space trigger the same action as a click.
   * @param {KeyboardEvent} event - The keydown event object.
   * @private
   * @returns {void}
   */
  handleButtonKeyDown(event) {
    const $btn = event.currentTarget;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleButtonClick(event);
    }
  }

  /**
   * Handles input focus events to set ARIA attributes dynamically.
   * @param {FocusEvent} event - The focus event object.
   * @private
   * @returns {void}
   */
  handleInputFocus(event) {
    const $input = event.currentTarget;

    // Set aria-describedby if not already set, linking to a help message.
    if ($input.hasAttribute('data-describe')) {
      const describedId = $input.getAttribute('data-describe');
      $input.setAttribute('aria-describedby', describedId);
    }

    // Add a visually hidden label for screen readers if missing.
    if (!$input.hasAttribute('aria-label') && !$input.labels?.length) {
      $input.setAttribute('aria-label', 'Input field');
    }
  }

  /**
   * Handles input blur events to clear temporary ARIA attributes.
   * @param {FocusEvent} event - The blur event object.
   * @private
   * @returns {void}
   */
  handleInputBlur(event) {
    const $input = event.currentTarget;

    // Remove aria-describedby set by focus if the attribute is dynamic.
    if ($input.hasAttribute('data-describe')) {
      $input.removeAttribute('aria-describedby');
    }
  }

  /**
   * Sets initial ARIA attributes for elements that lack them.
   * This is called after the DOM is loaded to ensure proper accessibility.
   * @private
   * @returns {void}
   */
  setInitialAriaAttributes() {
    // Ensure all buttons have an accessible name.
    this.$buttons.forEach(($btn) => {
      if (!$btn.hasAttribute('aria-label') && !$btn.textContent.trim()) {
        // Fallback to an empty accessible name to avoid accessibility errors.
        $btn.setAttribute('aria-label', '');
      }
    });

    // Ensure all form inputs have appropriate roles or labels.
    this.$inputs.forEach(($input) => {
      if ($input.hasAttribute('data-required') && !$input.hasAttribute('aria-required')) {
        $input.setAttribute('aria-required', 'true');
      }

      if ($input.hasAttribute('data-invalid') && !$input.hasAttribute('aria-invalid')) {
        $input.setAttribute('aria-invalid', 'true');
      }
    });
  }
}

// Export the Main class for use in other modules.
module.exports = Main;