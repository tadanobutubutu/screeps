const UNROTATE_ID = 'unrotate';

/**
 * Replaces the fake link with a proper button element
 * to ensure correct keyboard and screen reader behavior
 */
function replaceFakeLinkWithButton() {
    const link = document.getElementById(UNROTATE_ID);
    if (link && link.tagName === 'A' && link.getAttribute('href') === '#') {
        const button = document.createElement('button');
        button.id = UNROTATE_ID;
        button.textContent = link.textContent;
        button.className = link.className;
        button.onclick = () => {
            // Maintain any existing click handler functionality
            const clickEvent = new Event('click');
            link.dispatchEvent(clickEvent);
        };
        link.parentNode.replaceChild(button, link);
    }
}

// Initialize the replacement when the DOM is loaded
document.addEventListener('DOMContentLoaded', replaceFakeLinkWithButton);