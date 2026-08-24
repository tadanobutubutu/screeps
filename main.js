// main.js
// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

function rotateElement(element) {
    const currentRotation = parseInt(element.getAttribute('data-rotation') || '0', 10);
    element.setAttribute('data-rotation', (currentRotation + 90) % 360);
    element.style.transform = `rotate(${element.getAttribute('data-rotation')}deg)`;
}

function unrotateElement(element) {
    element.setAttribute('data-rotation', '0');
    element.style.transform = 'rotate(0deg)';
}

document.addEventListener('DOMContentLoaded', () => {
    const rotatable = document.getElementById('rotatable');
    const rotateBtn = document.getElementById('rotate');
    const unrotateBtn = document.getElementById('unrotate');

    if (rotateBtn) {
        rotateBtn.addEventListener('click', () => rotateElement(rotatable));
    }

    if (unrotateBtn) {
        unrotateBtn.addEventListener('click', () => unrotateElement(rotatable));
    }
});