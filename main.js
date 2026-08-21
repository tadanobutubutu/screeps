import { render } from 'react';
import { App } from './components/App';

const rootElement = document.getElementById('root');
if (rootElement) {
  render(<App />, rootElement);
}

// Main JavaScript file with accessibility fix
// REACT_036: Changed <a href="#"> to <button> for the rotate back action

document.addEventListener('DOMContentLoaded', function() {
    const rotatedElement = document.querySelector('.rotated-image');
    const unrotateBtn = document.getElementById('unrotate');
    
    if (rotatedElement && unrotateBtn) {
        unrotateBtn.addEventListener('click', function() {
            rotatedElement.classList.remove('rotated');
            setTimeout(function() {
                rotatedElement.style.transform = '';
            }, 300);
        });
    }
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { unrotateImage };
}