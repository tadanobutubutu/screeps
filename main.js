// Hypothetical main.js content
document.addEventListener('DOMContentLoaded', () => {
  // Assuming there's a script tag in the HTML that looks like this:
  // <script>
  //   const rotateBack = () => {
  //     // ... code to rotate back ...
  //   };
  // </script>
  // ... other JavaScript code ...

  // Replace the <a> tag with a <button> tag
  const unrotateLink = document.getElementById('unrotate');
  if (unrotateLink) {
    unrotateLink.innerHTML = `<button id="unrotate">rotate back</button>`;
    unrotateLink.addEventListener('click', rotateBack);
  }
});