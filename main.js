var main = function()
{
	if (!Game.time)
	{
		Game.cpu.generatePixel();
	}

	require('main.loop')(Game.time);
};

// Fix for REACT_036: replace hash-only link with a button for better accessibility
function fixFakeLink() {
  const link = document.getElementById('unrotate');
  if (link) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = link.textContent;
    button.onclick = link.onclick;
    link.parentNode.replaceChild(button, link);
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', fixFakeLink);
}
module.exports = main;