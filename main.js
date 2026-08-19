function rotate(element, degrees) {
  element.style.transform = `rotate(${degrees}deg)`;
}

function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.type = 'button';
  button.addEventListener('click', () => {
    const target = document.getElementById('rotatable');
    if (target) {
      rotate(target, 0);
    }
  });
  return button;
}

const container = document.getElementById('controls');
if (container) {
  container.appendChild(createUnrotateButton());
}