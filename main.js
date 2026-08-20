var main = function()
{
	if (!Game.time)
	{
		Game.cpu.generatePixel();
	}

	require('main.loop')(Game.time);
};

module.exports = main;