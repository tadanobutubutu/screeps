function render() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="container">
      <h1>Image Rotator</h1>
      <img id="image" src="image.jpg" alt="Rotatable image" />
      <button id="rotate" type="button">Rotate 90°</button>
      <button id="unrotate" type="button">rotate back</button>
    </div>
  `;

  const img = document.getElementById('image');
  let rotation = 0;

  document.getElementById('rotate').addEventListener('click', () => {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
  });

  document.getElementById('unrotate').addEventListener('click', () => {
    rotation = 0;
    img.style.transform = `rotate(${rotation}deg)`;
  });
}

render();