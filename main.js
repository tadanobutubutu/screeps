// TODO: Address accessibility issues from insight report
// TODO-hash: 4960bda783623b568ecb422d6e6eb9ceac6573ea

// Assuming there's a div with id 'my-div'
const myDiv = document.getElementById('my-div');

// To hide it from screen readers
myDiv.setAttribute('aria-hidden', true);

// You can also improve labels using HTML
const myButton = document.getElementById('my-button');
myButton.setAttribute('aria-label', 'A Button with special purpose');