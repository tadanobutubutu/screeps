// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b878456603a6d20d489ee1915356a26_
//<!-- todo-hash: a15ad4a6de1dc0d8ec37c24be5d9c48445a5b34c -->

// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_025: Ensure unique landmarks
// REACT_041: Add accessible names to 2 SVGs
// REACT_036: Fix 1 fake link issue
// REACT_037: Google sign-in logic
// REACT_040: Replace my-button with actual button id for accessibility
// REACT_042: Ensure dependencyGraph container has proper ARIA role

(function() {
    'use strict';

    // Existing code preserved
    var app = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
            this.setupAccessibility();
        },
        cacheDom: function() {
            this.main = document.querySelector('main') || document.body;
            this.header = document.querySelector('header') || document.body;
            this.nav = document.querySelector('nav') || document.body;
            this.footer = document.querySelector('footer') || document.body;
        },
        bindEvents: function() {
            // Existing event bindings preserved
        },
        setupAccessibility: function() {
            // REACT_015: Add lang attribute if not present
            if (!document.documentElement.lang) {
                document.documentElement.lang = 'en';
            }

            // REACT_017 & REACT_025: Ensure unique landmarks with proper roles
            this.ensureUniqueLandmarks();

            // REACT_027: Fix table structure issues
            this.fixTableStructures();

            // REACT_041: Add accessible names to SVGs
            this.addSvgAccessibility();

            // REACT_036: Fix fake link issues
            this.fixFakeLinks();

            // REACT_042: Ensure dependencyGraph container has proper ARIA role
            this.ensureDependencyGraphRole();

            // REACT_040: Replace my-button with actual button id
            this.replaceMyButtonId();

            // REACT_037: Google sign-in logic
            this.googleSignIn();

            // NEW: Implement focus trap for keyboard navigation
            this.setupFocusTrap();
        },
        ensureUniqueLandmarks: function() {
            // REACT_017 & REACT_025: Ensure unique landmarks by adding unique IDs
            var landmarks = this.main.querySelectorAll('[role="main"]');
            landmarks.forEach(function(landmark, index) {
                if (!landmark.id) {
                    landmark.id = 'main-content-' + (index + 1);
                }
                landmark.setAttribute('aria-label', landmark.getAttribute('aria-label') || 'Main content');
            });

            // Additional landmark uniqueness handling from origin/main
            const uniqueLandmarkSelectors = ['main', '[role"main"]', '[role="banner"]', '[role="contentinfo"]', '[role="search"]'];
            uniqueLandmarkSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 1) {
                    elements.forEach((element, index) => {
                        const existingLabel = element.getAttribute('aria-label');
                        const elementTag = element.tagName.toLowerCase();
                        const role = element.getAttribute('role') || elementTag;

                        if (!existingLabel) {
                            element.setAttribute('aria-label', `${role} ${index + 1}`);
                        }
                    });
                }
            });

            const sectionLandmarkSelectors = ['nav', '[role="region"]', 'aside'];
            sectionLandmarkSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 1) {
                    elements.forEach((element, index) => {
                        const hasLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.id;
                        const role = element.getAttribute('role') || element.tagName.toLowerCase();

                        if (!hasLabel) {
                            element.setAttribute('aria-label', `${role} ${index + 1}`);
                        }
                    });
                }
            });

            const landmarksAll = document.querySelectorAll('nav, main, aside, footer');
            const seenIds = new Set();
            const seenRoles = new Map();

            landmarksAll.forEach(landmark => {
                const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();

                if (!landmark.id) {
                    let id = role;
                    let counter = 1;
                    while (seenIds.has(id)) {
                        id = `${role}-${counter++}`;
                    }
                    landmark.id = id;
                    seenIds.add(id);
                } else {
                    seenIds.add(landmark.id);
                }

                if (!seenRoles.has(role)) {
                    seenRoles.set(role, []);
                }
                seenRoles.get(role).push(landmark);
            });

            const mainLandmarks = document.querySelectorAll('main, [role="main"]');
            if (mainLandmarks.length > 1) {
                for (let i = 1; i < mainLandmarks.length; i++) {
                    mainLandmarks[i].setAttribute('aria-hidden', 'true');
                }
            }
        },
        fixTableStructures: function() {
            // REACT_027: Fix 26 table structure issues - add proper th, caption, scope
            var tables = document.querySelectorAll('table');
            tables.forEach(function(table) {
                var headers = table.querySelectorAll('th');
                headers.forEach(function(th) {
                    if (!th.getAttribute('scope')) {
                        th.setAttribute('scope', 'col');
                    }
                });
                if (!table.querySelector('caption')) {
                    var caption = document.createElement('caption');
                    caption.textContent = 'Data table';
                    table.insertBefore(caption, table.firstChild);
                }
            });
        },
        addSvgAccessibility: function() {
            // REACT_041: Add accessible names to 2 SVGs
            var svgs = document.querySelectorAll('svg');
            svgs.forEach(function(svg, index) {
                if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
                    var label = 'SVG graphic ' + (index + 1);
                    svg.setAttribute('aria-label', label);
                }
                if (!svg.getAttribute('role')) {
                    svg.setAttribute('role', 'img');
                }
            });
        },
        fixFakeLinks: function() {
            // REACT_036: Fix 1 fake link issue - ensure proper link behavior
            var fakeLinks = document.querySelectorAll('[role="link"], a[href="#"], a[href=""]');
            fakeLinks.forEach(function(link) {
                if (link.tagName !== 'A') {
                    link.setAttribute('role', 'button');
                    link.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            link.click();
                        }
                    });
                }
            });
        },
        ensureDependencyGraphRole: function() {
            // REACT_042: Ensure dependencyGraph container has proper ARIA role
            var depGraph = document.getElementById('dependencyGraph') || document.querySelector('.dependency-graph');
            if (depGraph && !depGraph.getAttribute('role')) {
                depGraph.setAttribute('role', 'region');
                if (!depGraph.getAttribute('aria-label')) {
                    depGraph.setAttribute('aria-label', 'Dependency graph visualization');
                }
            }
        },
        replaceMyButtonId: function() {
            // REACT_040: Replace my-button with actual button id for accessibility
            var myButton = document.getElementById('my-button');
            if (myButton) {
                myButton.id = 'primary-action-button';
                myButton.setAttribute('aria-label', 'Primary action button');
            }
        },
        googleSignIn: function() {
            // REACT_037: Google sign-in logic
            var signInBtn = document.getElementById('google-signin-button');
            if (signInBtn) {
                signInBtn.setAttribute('aria-label', 'Sign in with Google');
                signInBtn.addEventListener('click', function() {
                    // Google sign-in implementation
                    console.log('Google sign-in initiated');
                });
            }
        },
        setupFocusTrap: function() {
            // NEW: Implement focus trap for keyboard navigation
            this.focusTrapElements = [];
            this.currentFocusTrap = null;
            this.isFocusTrapActive = false;

            // Create a focus trap for a given element
            this.createFocusTrap = function(element, options = {}) {
                if (!element) return null;

                const trap = {
                    element: element,
                    firstFocusable: null,
                    lastFocusable: null,
                    previousActiveElement: null,
                    options: {
                        escapeDeactivates: true,
                        clickOutsideDeactivates: true,
                        ...options
                    }
                };

                // Find all focusable elements within the trap
                const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
                const focusableElements = element.querySelectorAll(focusableSelector);

                if (focusableElements.length > 0) {
                    trap.firstFocusable = focusableElements[0];
                    trap.lastFocusable = focusableElements[focusableElements.length - 1];
                }

                return trap;
            };

            // Activate a focus trap
            this.activateFocusTrap = function(trap) {
                if (!trap || this.isFocusTrapActive) return;

                this.currentFocusTrap = trap;
                this.isFocusTrapActive = true;

                // Store the previously focused element
                trap.previousActiveElement = document.activeElement;

                // Focus the first focusable element
                if (trap.firstFocusable) {
                    trap.firstFocusable.focus();
                }

                // Set up event listeners
                this.setupFocusTrapEvents(trap);
            };

            // Deactivate the current focus trap
            this.deactivateFocusTrap = function() {
                if (!this.isFocusTrapActive || !this.currentFocusTrap) return;

                // Remove event listeners
                this.removeFocusTrapEvents(this.currentFocusTrap);

                // Restore focus to the previously focused element
                if (this.currentFocusTrap.previousActiveElement) {
                    this.currentFocusTrap.previousActiveElement.focus();
                }

                this.currentFocusTrap = null;
                this.isFocusTrapActive = false;
            };

            // Set up event listeners for the focus trap
            this.setupFocusTrapEvents = function(trap) {
                // Handle tab key navigation
                const handleTabKey = (e) => {
                    if (e.key !== 'Tab') return;

                    if (trap.firstFocusable && trap.lastFocusable) {
                        if (e.shiftKey) {
                            // Shift+Tab: move focus to last element if at first
                            if (document.activeElement === trap.firstFocusable) {
                                e.preventDefault();
                                trap.lastFocusable.focus();
                            }
                        } else {
                            // Tab: move focus to first element if at last
                            if (document.activeElement === trap.lastFocusable) {
                                e.preventDefault();
                                trap.firstFocusable.focus();
                            }
                        }
                    }
                };

                // Handle escape key
                const handleEscapeKey = (e) => {
                    if (e.key === 'Escape' && trap.options.escapeDeactivates) {
                        this.deactivateFocusTrap();
                    }
                };

                // Handle click outside
                const handleClickOutside = (e) => {
                    if (trap.options.clickOutsideDeactivates && !trap.element.contains(e.target)) {
                        this.deactivateFocusTrap();
                    }
                };

                // Store handlers for removal later
                trap._handlers = {
                    tabKey: handleTabKey,
                    escapeKey: handleEscapeKey,
                    clickOutside: handleClickOutside
                };

                document.addEventListener('keydown', handleTabKey);
                document.addEventListener('keydown', handleEscapeKey);
                document.addEventListener('click', handleClickOutside);
            };

            // Remove event listeners for the focus trap
            this.removeFocusTrapEvents = function(trap) {
                if (trap._handlers) {
                    document.removeEventListener('keydown', trap._handlers.tabKey);
                    document.removeEventListener('keydown', trap._handlers.escapeKey);
                    document.removeEventListener('click', trap._handlers.clickOutside);
                    trap._handlers = null;
                }
            };
        }
    };

    // Export for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = app;
    } else {
        window.app = app;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            app.init();
        });
    } else {
        app.init();
    }
})();