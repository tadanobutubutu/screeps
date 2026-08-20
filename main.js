// Fix: Replace the fake link with a proper button
const oldLink = document.getElementById('unrotate');
if (oldLink && oldLink.parentNode) {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.addEventListener('click', function(e) {
    e.preventDefault();
    rotateBackAction();
  });
  oldLink.parentNode.replaceChild(button, oldLink);
}