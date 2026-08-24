// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('target-image');
    const unrotateBtn = document.getElementById('unrotate');
    
    if (image && unrotateBtn) {
        let rotation = 0;
        
        // Rotate image clockwise
        const rotateButton = document.getElementById('rotate');
        if (rotateButton) {
            rotateButton.addEventListener('click', () => {
                rotation += 90;
                image.style.transform = `rotate(${rotation}deg)`;
            });
        }
        
        // Rotate back (reset to 0 degrees)
        unrotateBtn.addEventListener('click', () => {
            rotation = 0;
            image.style.transform = `rotate(${rotation}deg)`;
        });
    }
});

// Sample usage HTML that would accompany this:
// <img id="target-image" src="image.jpg" alt="Rotatable image" style="transition: transform 0.3s ease;" />
// <button id="rotate">Rotate</button>
// <button id="unrotate">rotate back</button>