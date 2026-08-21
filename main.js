var main = function()
{
	if (!Game.time)
	{
		Game.cpu.generatePixel();
	}

	// Wrap the primary content in <main> for accessibility
	document.querySelector('main').innerHTML = `
		<main>
			${document.querySelector('main').innerHTML}
		</main>
	`;

	require('main.loop')(Game.time);
};

module.exports = main;