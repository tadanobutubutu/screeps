// Original problematic code:
// element.innerHTML = '<a id="unrotate" href="#">rotate back</a>';
// OR in a template: `<a id="unrotate" href="#">rotate back</a>`

// Fixed code - replacing <a> with <button> for accessibility:
element.innerHTML = '<button id="unrotate">rotate back</button>';
// OR in a template: `<button id="unrotate">rotate back</button>`

// If you need to add click handler for the button:
// button.addEventListener('click', () => { /* rotation logic */ });