document.addEventListener('DOMContentLoaded', function() {
	const unrotateBtn = document.getElementById('unrotate');
	if (unrotateBtn) {
		unrotateBtn.setAttribute('aria-label', 'Rotate back');
		unrotateBtn.addEventListener('click', function() {
			document.body.style.transform = 'rotate(0deg)';
		});
	}
});

module.exports = {};

module.exports.loop = function () {
	// Main game loop logic goes here
	// This is a minimal valid main.js for syntax checking
};